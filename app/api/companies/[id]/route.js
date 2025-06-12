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

// Get a specific company
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
        { error: "Vous n'êtes pas autorisé à voir cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(company, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update a specific company
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
    const data = await request.json();
    
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if the user is the owner or has admin role in the company
    const member = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (company.ownerId !== user.id && (!member || member.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        vatNumber: data.vatNumber,
        siretNumber: data.siretNumber,
      },
    });
    
    return NextResponse.json(updatedCompany, { headers: corsHeaders });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete a specific company
export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const companyId = params.id;
    
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Only the owner can delete the company
    if (company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Seul le propriétaire peut supprimer cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Delete the company (cascade delete will handle members and invitations)
    await prisma.company.delete({
      where: { id: companyId },
    });
    
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
} 