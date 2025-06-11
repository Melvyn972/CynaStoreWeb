import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
// Supprimez l'import de sendEmail s'il est présent
// import { sendEmail } from "@/libs/resend";

// Get all companies for the current user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
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

    // Format response
    const companies = [
      ...ownedCompanies.map(company => ({
        ...company,
        isOwner: true,
      })),
      ...memberCompanies
        .filter(membership => !ownedCompanies.some(owned => owned.id === membership.companyId))
        .map(membership => ({
          ...membership.company,
          isOwner: false,
          role: membership.role,
        })),
    ];

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des entreprises" },
      { status: 500 }
    );
  }
}

// Create a new company
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { error: "Le nom de l'entreprise est requis" },
        { status: 400 }
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
        vatNumber: data.vatNumber || "",
        siretNumber: data.siretNumber || "",
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

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'entreprise" },
      { status: 500 }
    );
  }
}

// Delete a company
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "L'ID de l'entreprise est requis" },
        { status: 400 }
      );
    }
    
    // Check if the user is the owner of the company
    const company = await prisma.company.findUnique({
      where: { id },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }
    
    if (company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cette entreprise" },
        { status: 403 }
      );
    }
    
    // Delete the company (cascade delete will handle members and invitations)
    await prisma.company.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'entreprise" },
      { status: 500 }
    );
  }
} 