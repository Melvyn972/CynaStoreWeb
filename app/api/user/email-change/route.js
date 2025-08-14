import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import crypto from "crypto";
import { sendEmail } from "@/libs/smtp";

// POST /api/user/email-change - Request email change
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const { newEmail } = await request.json();

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Vérifier que le nouvel email n'est pas déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur actuel
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si le nouvel email est identique à l'actuel
    if (newEmail === user.email) {
      return NextResponse.json(
        { error: "Le nouvel email doit être différent de l'actuel" },
        { status: 400 }
      );
    }

    // Supprimer les anciennes demandes non utilisées
    await prisma.emailChangeRequest.deleteMany({
      where: {
        userId: user.id,
        used: false
      }
    });

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');
    
    // Créer une nouvelle demande (expire dans 24h)
    const emailChangeRequest = await prisma.emailChangeRequest.create({
      data: {
        userId: user.id,
        newEmail,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      }
    });

    // Envoyer l'email de confirmation
    const confirmationUrl = `${process.env.NEXTAUTH_URL}/auth/confirm-email-change?token=${token}`;
    
    try {
      await sendEmail({
        to: newEmail,
        subject: "CynaStore - Confirmation de changement d'adresse email",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
            <div style="background: white; padding: 30px; border-radius: 8px; color: #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6366f1; margin: 0; font-size: 28px; font-weight: bold;">CynaStore</h1>
                <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Plateforme de vente en ligne</p>
              </div>
              
              <h2 style="color: #333; text-align: center; margin-bottom: 25px; font-size: 24px;">Confirmation de changement d'adresse email</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                Bonjour,<br>
                Vous avez demandé à changer votre adresse email pour votre compte CynaStore. Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${confirmationUrl}" 
                   style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;">
                  ✉️ Confirmer le changement d'email
                </a>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #6366f1;">
                <p style="margin: 0 0 10px 0; color: #374151; font-weight: bold;">⚠️ Informations importantes :</p>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                  <li>Ce lien expire dans <strong>24 heures</strong></li>
                  <li>Vous serez automatiquement déconnecté après la confirmation</li>
                  <li>Vous devrez vous reconnecter avec votre nouvelle adresse email</li>
                  <li>Si vous n'avez pas demandé ce changement, ignorez cet email</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${confirmationUrl}" style="color: #6366f1; word-break: break-all;">${confirmationUrl}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">Cet email a été envoyé automatiquement par CynaStore</p>
                <p style="margin: 5px 0 0 0;">Pour toute question, contactez notre support</p>
              </div>
            </div>
          </div>
        `,
        text: `
          CynaStore - Confirmation de changement d'adresse email
          
          Bonjour,
          
          Vous avez demandé à changer votre adresse email pour votre compte CynaStore. 
          Pour confirmer ce changement, cliquez sur le lien suivant :
          
          ${confirmationUrl}
          
          ⚠️ Informations importantes :
          - Ce lien expire dans 24 heures
          - Vous serez automatiquement déconnecté après la confirmation
          - Vous devrez vous reconnecter avec votre nouvelle adresse email
          - Si vous n'avez pas demandé ce changement, ignorez cet email
          
          Cordialement,
          L'équipe CynaStore
        `
      });

      console.log('Email de confirmation envoyé à:', newEmail);

      return NextResponse.json({
        message: "Un lien de confirmation a été envoyé à votre nouvelle adresse email"
      });

    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      
      // Supprimer la demande créée car l'email n'a pas pu être envoyé
      await prisma.emailChangeRequest.delete({
        where: { id: emailChangeRequest.id }
      });

      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation. Veuillez réessayer." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error requesting email change:", error);
    return NextResponse.json(
      { error: "Erreur lors de la demande de changement d'email" },
      { status: 500 }
    );
  }
}

// GET /api/user/email-change?token=xxx - Confirm email change
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 400 }
      );
    }

    // Trouver la demande de changement
    const changeRequest = await prisma.emailChangeRequest.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!changeRequest) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 404 }
      );
    }

    // Vérifier si le token a expiré
    if (changeRequest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Le lien de confirmation a expiré" },
        { status: 400 }
      );
    }

    // Vérifier si le token a déjà été utilisé
    if (changeRequest.used) {
      return NextResponse.json(
        { error: "Ce lien a déjà été utilisé" },
        { status: 400 }
      );
    }

    // Vérifier que le nouvel email n'est pas déjà pris
    const existingUser = await prisma.user.findUnique({
      where: { email: changeRequest.newEmail }
    });

    if (existingUser && existingUser.id !== changeRequest.userId) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      );
    }

    // Mettre à jour l'email de l'utilisateur
    await prisma.user.update({
      where: { id: changeRequest.userId },
      data: { email: changeRequest.newEmail }
    });

    // Marquer la demande comme utilisée
    await prisma.emailChangeRequest.update({
      where: { id: changeRequest.id },
      data: { used: true }
    });

    return NextResponse.json({
      message: "Votre adresse email a été mise à jour avec succès",
      newEmail: changeRequest.newEmail
    });

  } catch (error) {
    console.error("Error confirming email change:", error);
    return NextResponse.json(
      { error: "Erreur lors de la confirmation du changement d'email" },
      { status: 500 }
    );
  }
}
