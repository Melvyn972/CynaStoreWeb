import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// Get cart items for a company
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    
    if (!companyId) {
      return NextResponse.json(
        { error: "L'ID de l'entreprise est requis" },
        { status: 400 }
      );
    }
    
    // Check if the user is a member of the company
    const isMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à accéder au panier de cette entreprise" },
        { status: 403 }
      );
    }
    
    // Get temporary cart items for this company stored in the user's session
    // In a real app, you might want to store this in a database table
    // For now, we'll use the regular cart table with a special field or convention
    
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: user.id,
        productId: {
          startsWith: `company_${companyId}_`, // Special convention for company cart items
        },
      },
    });
    
    // Map the cart items to remove the company prefix
    const mappedCartItems = cartItems.map(item => ({
      ...item,
      productId: item.productId.replace(`company_${companyId}_`, ""),
    }));
    
    return NextResponse.json(mappedCartItems);
  } catch (error) {
    console.error("Error fetching company cart:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du panier de l'entreprise" },
      { status: 500 }
    );
  }
}

// Add item to company cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    const { companyId, productId, quantity = 1 } = await request.json();
    
    if (!companyId || !productId) {
      return NextResponse.json(
        { error: "L'ID de l'entreprise et l'ID du produit sont requis" },
        { status: 400 }
      );
    }
    
    // Check if the user is a member of the company
    const isMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier le panier de cette entreprise" },
        { status: 403 }
      );
    }
    
    // Check if the product exists
    const product = await prisma.articles.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }
    
    // Create a special productId for company cart items
    const companyProductId = `company_${companyId}_${productId}`;
    
    // Check if the item is already in the cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId: companyProductId,
      },
    });
    
    if (existingCartItem) {
      // Update quantity
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      
      return NextResponse.json(updatedCartItem);
    } else {
      // Add new item
      const newCartItem = await prisma.cart.create({
        data: {
          userId: user.id,
          productId: companyProductId,
          quantity,
        },
      });
      
      return NextResponse.json(newCartItem);
    }
  } catch (error) {
    console.error("Error adding item to company cart:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'article au panier de l'entreprise" },
      { status: 500 }
    );
  }
}

// Update item in company cart
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    const { cartItemId, companyId, quantity } = await request.json();
    
    if (!cartItemId || !companyId || !quantity) {
      return NextResponse.json(
        { error: "L'ID de l'article, l'ID de l'entreprise et la quantité sont requis" },
        { status: 400 }
      );
    }
    
    // Check if the user is a member of the company
    const isMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier le panier de cette entreprise" },
        { status: 403 }
      );
    }
    
    // Find the cart item
    const cartItem = await prisma.cart.findUnique({
      where: { id: cartItemId },
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { error: "Article non trouvé dans le panier" },
        { status: 404 }
      );
    }
    
    // Check if the cart item belongs to the user
    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier cet article" },
        { status: 403 }
      );
    }
    
    // Check if the cart item is for the specified company
    if (!cartItem.productId.startsWith(`company_${companyId}_`)) {
      return NextResponse.json(
        { error: "Cet article n'appartient pas au panier de cette entreprise" },
        { status: 400 }
      );
    }
    
    // Update the cart item
    const updatedCartItem = await prisma.cart.update({
      where: { id: cartItemId },
      data: { quantity },
    });
    
    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error("Error updating company cart item:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article dans le panier de l'entreprise" },
      { status: 500 }
    );
  }
}

// Remove item from company cart
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    const { cartItemId, companyId } = await request.json();
    
    if (!cartItemId || !companyId) {
      return NextResponse.json(
        { error: "L'ID de l'article et l'ID de l'entreprise sont requis" },
        { status: 400 }
      );
    }
    
    // Check if the user is a member of the company
    const isMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier le panier de cette entreprise" },
        { status: 403 }
      );
    }
    
    // Find the cart item
    const cartItem = await prisma.cart.findUnique({
      where: { id: cartItemId },
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { error: "Article non trouvé dans le panier" },
        { status: 404 }
      );
    }
    
    // Check if the cart item belongs to the user
    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cet article" },
        { status: 403 }
      );
    }
    
    // Check if the cart item is for the specified company
    if (!cartItem.productId.startsWith(`company_${companyId}_`)) {
      return NextResponse.json(
        { error: "Cet article n'appartient pas au panier de cette entreprise" },
        { status: 400 }
      );
    }
    
    // Delete the cart item
    await prisma.cart.delete({
      where: { id: cartItemId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing company cart item:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article du panier de l'entreprise" },
      { status: 500 }
    );
  }
} 