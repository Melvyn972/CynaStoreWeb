import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/libs/auth-middleware';
import prisma from '@/libs/prisma';

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// GET /api/cart - Get current user's cart
export async function GET(request) {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: user.id,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
          }
        }
      }
    });

    // Format the response for mobile app compatibility
    const formattedItems = cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.article?.price || 0,
      title: item.article?.title || 'Unknown Product',
      product: {
        id: item.article?.id,
        title: item.article?.title,
        price: item.article?.price,
        image: item.article?.image,
      }
    }));

    return NextResponse.json({ items: formattedItems }, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to get cart items:', error);
    return NextResponse.json(
      { message: 'Failed to get cart items' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    const { productId, quantity } = await request.json();

    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { message: 'Invalid product ID or quantity' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if product exists
    const product = await prisma.articles.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity if item exists
      cartItem = await prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cart.create({
        data: {
          userId: user.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json(cartItem, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json(
      { message: 'Failed to add item to cart' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request) {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { message: 'Cart item ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cart.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem || cartItem.userId !== user.id) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Delete cart item
    await prisma.cart.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH /api/cart - Update cart item quantity
export async function PATCH(request) {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  try {
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { message: 'Invalid cart item ID or quantity' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cart.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem || cartItem.userId !== user.id) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Update cart item
    const updatedCartItem = await prisma.cart.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json(updatedCartItem, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return NextResponse.json(
      { message: 'Failed to update cart item' },
      { status: 500, headers: corsHeaders }
    );
  }
} 