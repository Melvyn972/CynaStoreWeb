import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/libs/auth-middleware";
import prisma from "@/libs/prisma";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function DELETE(req) {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get cart items for the user
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: user.id
      },
      include: {
        article: true  // Assuming there's a relation to the article
      }
    });

    // If cart is empty, return early
    if (cartItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Cart is already empty"
      }, { headers: corsHeaders });
    }

    // Create purchase records for each cart item
    for (const item of cartItems) {
      await prisma.purchase.create({
        data: {
          quantity: item.quantity,
          user: {
            connect: { id: user.id }
          },
          article: {
            connect: { id: item.productId }
          }
        }
      });
    }
    
    // Delete all cart items for this user
    await prisma.cart.deleteMany({
      where: {
        userId: user.id
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Cart cleared and purchases created successfully"
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500, headers: corsHeaders }
    );
  }
} 