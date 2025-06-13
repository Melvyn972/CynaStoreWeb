import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/libs/auth-middleware";
import prisma from "@/libs/prisma";
import { sendEmail } from "@/libs/smtp";
import crypto from "crypto";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Send invitation to join company
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
    const { email, role = 'member', message } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
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
    
    // Check if the user has permission to invite members (owner only for now)
    if (company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Seul le propriétaire peut inviter des membres" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Check if user exists
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!invitedUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé avec cet email" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Check if user is already a member
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
        { error: "Cette personne est déjà membre de l'entreprise" },
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
        { error: "Une invitation est déjà en attente pour cette personne" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Create invitation
    const invitation = await prisma.companyInvitation.create({
      data: {
        companyId,
        userId: invitedUser.id,
        email,
        role: role.toUpperCase(),
        token,
        expiresAt,
      },
    });
    
    // Send email invitation asynchronously (don't wait for completion)
    const inviteUrl = `${process.env.NEXTAUTH_URL}/companies/invitation/${token}`;
    
    // Send email in background - don't wait for it
    setImmediate(async () => {
      try {
        await sendEmail({
          to: email,
          subject: `Invitation à rejoindre ${company.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Invitation à rejoindre ${company.name}</h2>
              <p>Bonjour,</p>
              <p>${user.name} vous invite à rejoindre l'entreprise "${company.name}" en tant que ${role === 'admin' ? 'administrateur' : 'membre'}.</p>
              ${message ? `<p><strong>Message personnel :</strong></p><p style="font-style: italic;">${message}</p>` : ''}
              <p>Cliquez sur le lien suivant pour accepter l'invitation :</p>
              <p><a href="${inviteUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accepter l'invitation</a></p>
              <p style="color: #666; font-size: 14px;">Cette invitation expire dans 7 jours.</p>
              <p style="color: #666; font-size: 14px;">Si vous n'arrivez pas à cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :<br>${inviteUrl}</p>
            </div>
          `,
        });
        console.log(`✅ Invitation email sent to ${email}`);
      } catch (emailError) {
        console.error('⚠️ Failed to send invitation email (non-blocking):', emailError);
        // Don't delete invitation if email fails - user can still see it in their dashboard
      }
    });
    
    return NextResponse.json(
      { 
        success: true,
        message: "Invitation envoyée avec succès",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role.toLowerCase(),
        }
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'invitation" },
      { status: 500, headers: corsHeaders }
    );
  }
} 