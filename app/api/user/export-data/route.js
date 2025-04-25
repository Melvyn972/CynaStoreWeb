import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

export async function GET(request) {
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
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }
    
    // Format user data for export
    const userData = {
      personalInformation: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.image,
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
        role: user.role,
      },
      purchases: user.purchases.map(purchase => ({
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
    return NextResponse.json(userData, { status: 200 });
    
  } catch (error) {
    console.error("Error exporting user data:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'exportation des données." },
      { status: 500 }
    );
  }
} 