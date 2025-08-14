import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/libs/prisma";
import crypto from "crypto";
import { sendEmail } from "@/libs/smtp";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const { email, token } = await request.json();

    // If token is provided, verify the magic link
    if (token) {
      return await verifyMagicLink(token);
    }

    // If email is provided, send magic link
    if (email) {
      return await sendMagicLink(email);
    }

    return NextResponse.json(
      { error: "Email or token is required" },
      { status: 400, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

async function sendMagicLink(email) {
  try {
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          emailVerified: new Date(),
        }
      });
    }

    // Generate magic link token
    const magicToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the token in the VerificationToken table (NextAuth.js table)
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token: magicToken,
        expires: expiresAt,
      }
    });

    // Send email with magic link (you'll need to implement sendEmail)
    const magicLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-mobile?token=${magicToken}`;
    
    // Always send email via SMTP
    await sendEmail({
      to: email,
      subject: "CynaStore - Connexion sécurisée",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin: 0; font-size: 28px; font-weight: bold;">CynaStore</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Plateforme de vente en ligne</p>
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 25px; font-size: 24px;">Connexion sécurisée</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Bonjour,<br>
              Vous avez demandé à vous connecter à votre compte CynaStore. Pour accéder à votre espace personnel, veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${magicLink}" 
                 style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;">
                🔐 Se connecter à CynaStore
              </a>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #6366f1;">
              <p style="margin: 0 0 10px 0; color: #374151; font-weight: bold;">⚠️ Informations importantes :</p>
              <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                <li>Ce lien expire dans <strong>15 minutes</strong> pour des raisons de sécurité</li>
                <li>Ne partagez jamais ce lien avec quelqu'un d'autre</li>
                <li>Si vous n'avez pas demandé cette connexion, ignorez cet email</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
              <a href="${magicLink}" style="color: #6366f1; word-break: break-all;">${magicLink}</a>
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
        CynaStore - Connexion sécurisée
        
        Bonjour,
        
        Vous avez demandé à vous connecter à votre compte CynaStore. 
        Pour accéder à votre espace personnel, cliquez sur le lien suivant :
        
        ${magicLink}
        
        ⚠️ Informations importantes :
        - Ce lien expire dans 15 minutes pour des raisons de sécurité
        - Ne partagez jamais ce lien avec quelqu'un d'autre
        - Si vous n'avez pas demandé cette connexion, ignorez cet email
        
        Cordialement,
        L'équipe CynaStore
      `
    });

    // In development, also return the token for mobile app testing
    const response = { message: "Magic link sent to your email" };
    if (process.env.NODE_ENV === 'development') {
      response.devToken = magicToken;
    }

    return NextResponse.json(response, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Error sending magic link:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500, headers: corsHeaders }
    );
  }
}

async function verifyMagicLink(token) {
  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token }
      });
      
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token }
    });

    // Create JWT token
    const jwtToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data and token
    return NextResponse.json(
      {
        token: jwtToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error verifying magic link:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500, headers: corsHeaders }
    );
  }
} 