import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

export async function DELETE(request) {
  console.log(request);
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }
    
    // Delete user data
    // This cascades to delete related records (accounts, sessions, etc.) due to the Prisma schema setup
    await prisma.user.delete({
      where: { id: user.id },
    });
    
    // Return success
    return NextResponse.json(
      { message: "Compte supprimé avec succès." },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error deleting user account:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la suppression du compte." },
      { status: 500 }
    );
  }
} 