import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { name, phone, address } = await request.json();
    
    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        address,
      },
    });
    
    // Return success response
    return NextResponse.json(
      { 
        message: "Profil mis à jour avec succès",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating user profile:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
} 