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

// Get orders/purchases for a specific company
export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const companyId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;
    
    // Check if the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404, headers: corsHeaders }
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
    
    if (!isMember && company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à voir les commandes de cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Get company purchases with article details
    const purchases = await prisma.companyPurchase.findMany({
      where: { companyId },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
          },
        },
      },
      orderBy: { purchaseDate: 'desc' },
      skip: offset,
      take: limit,
    });

    // Format orders for consistent API response
    const orders = purchases.map(purchase => ({
      id: purchase.id,
      orderId: purchase.orderId,
      description: purchase.article?.title || 'Article supprimé',
      amount: (purchase.article?.price || 0) * purchase.quantity,
      quantity: purchase.quantity,
      date: purchase.purchaseDate,
      status: purchase.paidAt ? 'completed' : 'pending',
      article: purchase.article,
    }));

    // Get total count for pagination
    const totalCount = await prisma.companyPurchase.count({
      where: { companyId },
    });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching company orders:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
} 