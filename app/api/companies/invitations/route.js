import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { sendEmail } from "@/libs/resend";
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
    
    // Check if the user is the owner of the company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        owner: true
      }
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }
    
    if (company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à inviter des membres à cette entreprise" },
        { status: 403 }
      );
    }
    
    // Check if user already exists
    let invitedUser = await prisma.user.findUnique({
      where: { email },
    });
    
    // Check if the user is already a member of the company
    if (invitedUser) {
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
    }
    
    // Generate a unique token for the invitation
    const token = uuidv4();
    
    // Create invitation
    const invitation = await prisma.companyInvitation.create({
      data: {
        company: { connect: { id: companyId } },
        user: invitedUser ? { connect: { id: invitedUser.id } } : undefined,
        userId: invitedUser?.id || "", // We need to provide a value even if user doesn't exist yet
        email,
        role: role || "MEMBER",
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    
    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/companies/invitations/${token}`;
    
    await sendEmail({
      to: email,
      subject: `Invitation à rejoindre ${company.name} sur CynaStore`,
      text: `Bonjour,\n\nVous avez été invité à rejoindre l'entreprise ${company.name} sur CynaStore par ${user.name || user.email}.\n\nPour accepter cette invitation, veuillez cliquer sur le lien suivant : ${invitationUrl}\n\nCe lien expirera dans 7 jours.\n\nCordialement,\nL'équipe CynaStore`,
      html: `
        <p>Bonjour,</p>
        <p>Vous avez été invité à rejoindre l'entreprise <strong>${company.name}</strong> sur CynaStore par ${user.name || user.email}.</p>
        <p>Pour accepter cette invitation, veuillez cliquer sur le bouton ci-dessous :</p>
        <p><a href="${invitationUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accepter l'invitation</a></p>
        <p>Ce lien expirera dans 7 jours.</p>
        <p>Cordialement,<br>L'équipe CynaStore</p>
      `,
    });
    
    return NextResponse.json({ success: true, invitation });
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
    
    const { token, action } = await request.json();
    
    if (!token || !action) {
      return NextResponse.json(
        { error: "Le token et l'action sont requis" },
        { status: 400 }
      );
    }
    
    if (action !== "accept" && action !== "decline") {
      return NextResponse.json(
        { error: "L'action doit être 'accept' ou 'decline'" },
        { status: 400 }
      );
    }
    
    // Find the invitation
    const invitation = await prisma.companyInvitation.findUnique({
      where: { token },
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
    if (invitation.email !== user.email) {
      return NextResponse.json(
        { error: "Cette invitation n'est pas destinée à votre compte" },
        { status: 403 }
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
          status: "ACCEPTED",
          userId: user.id // Update with the real user ID
        },
      });
      
      return NextResponse.json({
        success: true,
        message: "Vous avez rejoint l'entreprise avec succès",
        company: invitation.company,
      });
    } else {
      // Decline invitation
      await prisma.companyInvitation.update({
        where: { id: invitation.id },
        data: { 
          status: "DECLINED",
          userId: user.id // Update with the real user ID
        },
      });
      
      return NextResponse.json({
        success: true,
        message: "Vous avez refusé l'invitation",
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