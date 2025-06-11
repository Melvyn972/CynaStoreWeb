import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { v4 as uuidv4 } from "uuid";

// Get all invitations for current user
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
    
    // Get pending invitations for the user
    const invitations = await prisma.companyInvitation.findMany({
      where: { 
        userId: user.id,
        status: "PENDING"
      },
      include: {
        company: true
      }
    });
    
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des invitations" },
      { status: 500 }
    );
  }
}

// Send an invitation to join a company
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

    const { companyId, email, role } = await request.json();
    
    if (!companyId || !email) {
      return NextResponse.json(
        { error: "L'ID de l'entreprise et l'email sont requis" },
        { status: 400 }
      );
    }

    // Check if the user has permission to invite (OWNER or ADMIN)
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        owner: true,
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
        { error: "Vous devez être propriétaire ou administrateur pour inviter des membres" },
        { status: 403 }
      );
    }

    // Verify that the invited user exists
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!invitedUser) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec cette adresse email. L'utilisateur doit avoir un compte pour être invité." },
        { status: 404 }
      );
    }

    // Check if the user is already a member of the company
    const existingMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: invitedUser.id,
        },
      },
    });
    
    if (existingMember) {
      return NextResponse.json(
        { error: "Cet utilisateur est déjà membre de l'entreprise" },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.companyInvitation.findFirst({
      where: {
        companyId,
        userId: invitedUser.id,
        status: "PENDING",
      },
    });
    
    if (existingInvitation) {
      return NextResponse.json(
        { error: "Une invitation est déjà en attente pour cet utilisateur" },
        { status: 400 }
      );
    }

    // Generate a unique token for the invitation
    const token = uuidv4();

    // Create invitation
    const invitation = await prisma.companyInvitation.create({
      data: {
        companyId: companyId,
        userId: invitedUser.id,
        email: email,
        role: role || "MEMBER",
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    console.log(`✅ Invitation created: ${invitedUser.email} invited to ${company.name}`);
    
    return NextResponse.json({ 
      success: true, 
      invitation,
      message: `Invitation envoyée à ${invitedUser.name || invitedUser.email}. L'utilisateur pourra voir et gérer cette invitation dans son tableau de bord.`
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'invitation" },
      { status: 500 }
    );
  }
}

// Accept or decline an invitation
export async function PATCH(request) {
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
    
    // MODIFICATION: Accepter invitationId au lieu de token
    const { invitationId, action } = await request.json();
    
    if (!invitationId || !action) {
      return NextResponse.json(
        { error: "L'ID de l'invitation et l'action sont requis" },
        { status: 400 }
      );
    }
    
    if (action !== "accept" && action !== "decline") {
      return NextResponse.json(
        { error: "L'action doit être 'accept' ou 'decline'" },
        { status: 400 }
      );
    }
    
    // Find the invitation by ID instead of token
    const invitation = await prisma.companyInvitation.findUnique({
      where: { id: invitationId },
      include: {
        company: true,
      },
    });
    
    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }
    
    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      await prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      
      return NextResponse.json(
        { error: "Cette invitation a expiré" },
        { status: 400 }
      );
    }
    
    // Check if invitation is for this user
    if (invitation.userId !== user.id) {
      return NextResponse.json(
        { error: "Cette invitation ne vous est pas destinée" },
        { status: 403 }
      );
    }
    
    // Check if invitation is still pending
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cette invitation a déjà été traitée" },
        { status: 400 }
      );
    }
    
    if (action === "accept") {
      // Check if the user is already a member of the company
      const existingMember = await prisma.companyMember.findUnique({
        where: {
          companyId_userId: {
            companyId: invitation.companyId,
            userId: user.id,
          },
        },
      });
      
      if (existingMember) {
        await prisma.companyInvitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" },
        });
        
        return NextResponse.json(
          { error: "Vous êtes déjà membre de cette entreprise" },
          { status: 400 }
        );
      }
      
      // Add user to company members
      await prisma.companyMember.create({
        data: {
          company: { connect: { id: invitation.companyId } },
          user: { connect: { id: user.id } },
          role: invitation.role,
        },
      });
      
      // Update invitation status
      await prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: { 
          status: "ACCEPTED"
        },
      });
      
      return NextResponse.json({
        success: true,
        message: `Vous avez rejoint l'entreprise ${invitation.company.name} avec succès`,
        company: invitation.company,
      });
    } else {
      // Decline invitation
      await prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: { 
          status: "DECLINED"
        },
      });
      
      return NextResponse.json({
        success: true,
        message: `Vous avez refusé l'invitation à rejoindre ${invitation.company.name}`,
      });
    }
  } catch (error) {
    console.error("Error processing invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'invitation" },
      { status: 500 }
    );
  }
} 