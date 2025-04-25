import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import prisma from '@/libs/prisma';

// GET /api/cart - Get current user's cart
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Failed to get cart items:', error);
    return NextResponse.json(
      { message: 'Failed to get cart items' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();

    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { message: 'Invalid product ID or quantity' },
        { status: 400 }
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
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
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
          userId: session.user.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json(
      { message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { message: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cart.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cart.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

// PATCH /api/cart - Update cart item quantity
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { message: 'Invalid cart item ID or quantity' },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cart.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Cart item not found' },
        { status: 404 }
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

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return NextResponse.json(
      { message: 'Failed to update cart item' },
      { status: 500 }
    );
  }
} 