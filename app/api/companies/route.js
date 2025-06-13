import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/libs/auth-middleware";
import prisma from "@/libs/prisma";
// Supprimez l'import de sendEmail s'il est présent
// import { sendEmail } from "@/libs/resend";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Get all companies for the current user
export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get companies owned by the user
    const ownedCompanies = await prisma.company.findMany({
      where: { ownerId: user.id },
    });

    // Get companies where user is a member
    const memberCompanies = await prisma.companyMember.findMany({
      where: { userId: user.id },
      include: { company: true },
    });

    // Format response for mobile app
    const companies = [
      ...ownedCompanies.map(company => ({
        id: company.id,
        name: company.name,
        description: company.description,
        address: company.address,
        phone: company.phone,
        email: company.email,
        website: company.website,
        tva: company.vatNumber,
        siret: company.siretNumber,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        role: 'owner',
      })),
      ...memberCompanies
        .filter(membership => !ownedCompanies.some(owned => owned.id === membership.companyId))
        .map(membership => ({
          id: membership.company.id,
          name: membership.company.name,
          description: membership.company.description,
          address: membership.company.address,
          phone: membership.company.phone,
          email: membership.company.email,
          website: membership.company.website,
          tva: membership.company.vatNumber,
          siret: membership.company.siretNumber,
          createdAt: membership.company.createdAt,
          updatedAt: membership.company.updatedAt,
          role: membership.role.toLowerCase(),
        })),
    ];

    return NextResponse.json({ companies }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entreprises" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create a new company
export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }

    const data = await request.json();

    if (!data.name || !data.siret) {
      return NextResponse.json(
        { error: "Le nom de l'entreprise et le SIRET sont requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name: data.name,
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        vatNumber: data.tva || "",
        siretNumber: data.siret || "",
        owner: {
          connect: { id: user.id },
        },
        members: {
          create: {
            user: {
              connect: { id: user.id },
            },
            role: "OWNER",
          },
        },
      },
    });

    // Format response for mobile app
    const formattedCompany = {
      id: company.id,
      name: company.name,
      description: company.description,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website,
      tva: company.vatNumber,
      siret: company.siretNumber,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      role: 'owner',
    };

    return NextResponse.json({ company: formattedCompany }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete a company
export async function DELETE(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "L'ID de l'entreprise est requis" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if the user is the owner of the company
    const company = await prisma.company.findUnique({
      where: { id },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    if (company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Delete the company (cascade delete will handle members and invitations)
    await prisma.company.delete({
      where: { id },
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