import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/libs/auth-middleware";
import prisma from "@/libs/prisma";
import { v4 as uuidv4 } from "uuid";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Get all invitations for current user
export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;
    
    // Get pending invitations for the user
    const invitations = await prisma.companyInvitation.findMany({
      where: { 
        userId: user.id,
        status: "PENDING"
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Format invitations for mobile app
    const formattedInvitations = invitations.map(invitation => ({
      id: invitation.id,
      companyName: invitation.company.name,
      companyId: invitation.company.id,
      inviterName: 'Administrateur', // Could be enhanced to include actual inviter name
      role: invitation.role.toLowerCase(),
      message: invitation.message || '',
      receivedAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
    }));

    // Get total count for pagination
    const totalCount = await prisma.companyInvitation.count({
      where: { 
        userId: user.id,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      invitations: formattedInvitations,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des invitations" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Send an invitation to join a company
export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { companyId, email, role } = await request.json();
    
    if (!companyId || !email) {
      return NextResponse.json(
        { error: "L'ID de l'entreprise et l'email sont requis" },
        { status: 400, headers: corsHeaders }
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
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if user is owner or admin
    const isOwner = company.ownerId === user.id;
    const memberRole = company.members[0]?.role;
    const isAdmin = memberRole === "ADMIN";
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Vous devez être propriétaire ou administrateur pour inviter des membres" },
        { status: 403, headers: corsHeaders }
      );
    }

    // Verify that the invited user exists
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!invitedUser) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec cette adresse email. L'utilisateur doit avoir un compte pour être invité." },
        { status: 404, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
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
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'invitation" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Accept or decline an invitation
export async function PATCH(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { invitationId, action } = await request.json();
    
    if (!invitationId || !action) {
      return NextResponse.json(
        { error: "L'ID de l'invitation et l'action sont requis" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (action !== "accept" && action !== "decline") {
      return NextResponse.json(
        { error: "L'action doit être 'accept' ou 'decline'" },
        { status: 400, headers: corsHeaders }
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
        { status: 404, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if invitation is for this user
    if (invitation.userId !== user.id) {
      return NextResponse.json(
        { error: "Cette invitation ne vous est pas destinée" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Check if invitation is still pending
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cette invitation a déjà été traitée" },
        { status: 400, headers: corsHeaders }
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
          { status: 400, headers: corsHeaders }
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
      }, { headers: corsHeaders });
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
      }, { headers: corsHeaders });
    }
  } catch (error) {
    console.error("Error processing invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'invitation" },
      { status: 500, headers: corsHeaders }
    );
  }
} 