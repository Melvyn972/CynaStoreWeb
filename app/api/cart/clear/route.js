import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

export async function DELETE(req) {
  console.log(req)
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get cart items for the user
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: session.user.id
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
      });
    }

    // Create purchase records for each cart item
    for (const item of cartItems) {
      await prisma.purchase.create({
        data: {
          quantity: item.quantity,
          user: {
            connect: { id: session.user.id }
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
        userId: session.user.id
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Cart cleared and purchases created successfully"
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
} 