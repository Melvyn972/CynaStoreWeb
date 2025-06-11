import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// Update member role
export async function PATCH(request, { params }) {
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

    const { id: companyId, memberId } = params;
    const { role } = await request.json();

    if (!role || !["MEMBER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide. Doit être MEMBER ou ADMIN" },
        { status: 400 }
      );
    }

    // Check if user has permission to modify roles (OWNER or ADMIN)
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
    
    const isOwner = company.ownerId === user.id;
    const currentUserRole = company.members[0]?.role;
    const isAdmin = currentUserRole === "ADMIN";
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Vous devez être propriétaire ou administrateur pour modifier les rôles" },
        { status: 403 }
      );
    }

    // Find the member to update
    const memberToUpdate = await prisma.companyMember.findUnique({
      where: { id: memberId },
      include: { user: true }
    });

    if (!memberToUpdate) {
      return NextResponse.json(
        { error: "Membre non trouvé" },
        { status: 404 }
      );
    }

    if (memberToUpdate.companyId !== companyId) {
      return NextResponse.json(
        { error: "Ce membre ne fait pas partie de cette entreprise" },
        { status: 400 }
      );
    }

    // Don't allow changing the owner's role
    if (memberToUpdate.userId === company.ownerId) {
      return NextResponse.json(
        { error: "Impossible de modifier le rôle du propriétaire" },
        { status: 400 }
      );
    }

    // Update the member's role
    const updatedMember = await prisma.companyMember.update({
      where: { id: memberId },
      data: { role },
      include: { user: true }
    });

    console.log(`✅ Role updated: ${memberToUpdate.user.email} role changed to ${role} in ${company.name}`);

    return NextResponse.json({
      success: true,
      member: updatedMember,
      message: `Rôle de ${memberToUpdate.user.name || memberToUpdate.user.email} mis à jour vers ${role === 'ADMIN' ? 'Administrateur' : 'Membre'}`
    });

  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du rôle" },
      { status: 500 }
    );
  }
} 