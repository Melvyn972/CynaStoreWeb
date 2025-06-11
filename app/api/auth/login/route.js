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
      subject: "CynaStore - Magic Link Login",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Sign in to CynaStore</h2>
          <p>Click the button below to sign in to your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #007AFF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Sign In to CynaStore
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">
            ${magicLink}
          </p>
          <p><small>This link will expire in 15 minutes for security reasons.</small></p>
          <p><small>If you didn't request this login, you can safely ignore this email.</small></p>
        </div>
      `,
      text: `Sign in to CynaStore\n\nClick this link to sign in: ${magicLink}\n\nThis link will expire in 15 minutes.`
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