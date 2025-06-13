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

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Get user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        purchases: {
          select: {
            purchaseDate: true,
            article: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
                price: true,
              },
            },
          },
        },
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Format user data for export
    const exportData = {
      personalInformation: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        profileImage: userData.image,
        accountCreated: userData.createdAt,
        lastUpdated: userData.updatedAt,
        role: userData.role,
      },
      purchases: userData.purchases.map(purchase => ({
        date: purchase.purchaseDate,
        article: {
          id: purchase.article.id,
          title: purchase.article.title,
          description: purchase.article.description,
          category: purchase.article.category,
          price: purchase.article.price,
        },
      })),
      dataExportDate: new Date().toISOString(),
    };
    
    // Return user data
    return NextResponse.json(exportData, { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error("Error exporting user data:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'exportation des données." },
      { status: 500, headers: corsHeaders }
    );
  }
} 