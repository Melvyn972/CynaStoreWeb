import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
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

// GET /api/user/profile - Get user profile
export async function GET(request) {
  try {
    // Try mobile auth first, then web auth
    let user = await getAuthenticatedUser(request);
    
    if (!user) {
      // Fallback to NextAuth session for web app
      const session = await getServerSession(authOptions);
      if (session?.user) {
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            image: true,
            createdAt: true,
          }
        });
      }
    } else {
      // Get full user data for mobile auth
      user = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          role: true,
          image: true,
          createdAt: true,
        }
      });
    }
    
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(user, { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error("Error getting user profile:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la récupération du profil." },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request) {
  try {
    // Try mobile auth first, then web auth
    let user = await getAuthenticatedUser(request);
    let userEmail = user?.email;
    
    if (!user) {
      // Fallback to NextAuth session for web app
      const session = await getServerSession(authOptions);
      if (session?.user) {
        userEmail = session.user.email;
      }
    }
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Parse request body
    const { name, phone, address } = await request.json();
    
    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
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
          role: updatedUser.role,
          image: updatedUser.image,
        }
      },
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error("Error updating user profile:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour du profil." },
      { status: 500, headers: corsHeaders }
    );
  }
} 