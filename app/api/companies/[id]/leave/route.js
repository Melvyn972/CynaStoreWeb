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

// Leave a company (member removes themselves)
export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const companyId = params.id;
    
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
    
    // Check if user is the owner
    if (company.ownerId === user.id) {
      return NextResponse.json(
        { error: "Le propriétaire ne peut pas quitter l'entreprise. Transférez d'abord la propriété ou supprimez l'entreprise." },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if user is a member
    const membership = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!membership) {
      return NextResponse.json(
        { error: "Vous n'êtes pas membre de cette entreprise" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Remove membership
    await prisma.companyMember.delete({
      where: {
        id: membership.id,
      },
    });
    
    return NextResponse.json(
      { 
        success: true,
        message: "Vous avez quitté l'entreprise avec succès"
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error leaving company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sortie de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
} 