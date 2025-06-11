import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// Get all members of a company
export async function GET(request, { params }) {
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
    
    const companyId = params.id;
    
    // Check if the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
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
    
    if (!isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à voir les membres de cette entreprise" },
        { status: 403 }
      );
    }
    
    // Get all members of the company
    const members = await prisma.companyMember.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching company members:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des membres de l'entreprise" },
      { status: 500 }
    );
  }
}

// Delete a member from a company
export async function DELETE(request, { params }) {
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
    
    const companyId = params.id;
    const { memberId } = await request.json();
    
    if (!memberId) {
      return NextResponse.json(
        { error: "L'ID du membre est requis" },
        { status: 400 }
      );
    }
    
    // Check if the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        members: {
          where: { userId: user.id }
        }
      }
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }
    
    // Check if user is owner or admin
    const isOwner = company.ownerId === user.id;
    const memberRole = company.members[0]?.role;
    const isAdmin = memberRole === "ADMIN";
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Vous devez être propriétaire ou administrateur pour supprimer des membres" },
        { status: 403 }
      );
    }
    
    // Check if trying to remove the owner
    const memberToRemove = await prisma.companyMember.findUnique({
      where: {
        id: memberId,
      },
    });
    
    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Membre non trouvé" },
        { status: 404 }
      );
    }
    
    if (memberToRemove.userId === company.ownerId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer le propriétaire de l'entreprise" },
        { status: 400 }
      );
    }
    
    // Delete member
    await prisma.companyMember.delete({
      where: {
        id: memberId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing company member:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du membre de l'entreprise" },
      { status: 500 }
    );
  }
} 