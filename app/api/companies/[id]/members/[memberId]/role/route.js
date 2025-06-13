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

// Update member role in a company
export async function PUT(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const companyId = params.id;
    const memberId = params.memberId;
    const { role } = await request.json();
    
    if (!role || !['admin', 'member'].includes(role.toLowerCase())) {
      return NextResponse.json(
        { error: "Rôle invalide. Utilisez 'admin' ou 'member'." },
        { status: 400, headers: corsHeaders }
      );
    }
    
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
    
    // Check if user is the owner (only owners can change roles)
    if (company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Seul le propriétaire peut modifier les rôles des membres" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Find the member to update
    const member = await prisma.companyMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });
    
    if (!member) {
      return NextResponse.json(
        { error: "Membre non trouvé" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if member belongs to this company
    if (member.companyId !== companyId) {
      return NextResponse.json(
        { error: "Ce membre n'appartient pas à cette entreprise" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Can't change owner role
    if (member.userId === company.ownerId) {
      return NextResponse.json(
        { error: "Impossible de modifier le rôle du propriétaire" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Update member role
    const updatedMember = await prisma.companyMember.update({
      where: { id: memberId },
      data: { role: role.toUpperCase() },
      include: { user: true },
    });
    
    return NextResponse.json(
      {
        success: true,
        message: `Rôle de ${updatedMember.user.name} modifié en ${role}`,
        member: {
          id: updatedMember.id,
          name: updatedMember.user.name,
          email: updatedMember.user.email,
          role: updatedMember.role.toLowerCase(),
          joinedAt: updatedMember.joinedAt,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du rôle du membre" },
      { status: 500, headers: corsHeaders }
    );
  }
} 