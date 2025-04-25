import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// Get current consent settings
export async function GET(request) {
  console.log(request);
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        consentMarketing: true,
        consentAnalytics: true,
        consentThirdParty: true,
        dataRetentionPeriod: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }
    
    // Get consent history for the user
    const consentHistory = await prisma.consentHistory.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 50, // Get the latest 50 records
    });
    
    // Format consent data
    const consent = {
      marketing: user.consentMarketing,
      analytics: user.consentAnalytics,
      thirdParty: user.consentThirdParty,
    };
    
    // Return consent data and history
    return NextResponse.json({
      consent,
      dataRetentionPeriod: user.dataRetentionPeriod,
      history: consentHistory
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error retrieving consent settings:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la récupération des préférences de consentement." },
      { status: 500 }
    );
  }
}

// Update consent settings
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { consent, dataRetentionPeriod } = await request.json();
    
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        consentMarketing: true,
        consentAnalytics: true,
        consentThirdParty: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    // Get IP address and user agent from the request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(/, /)[0] : "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";
    
    // Create history entries for any changed consents
    const historyEntries = [];
    
    if (user.consentMarketing !== consent.marketing) {
      historyEntries.push({
        userId: user.id,
        consentType: "marketing",
        status: consent.marketing,
        ipAddress,
        userAgent
      });
    }
    
    if (user.consentAnalytics !== consent.analytics) {
      historyEntries.push({
        userId: user.id,
        consentType: "analytics",
        status: consent.analytics,
        ipAddress,
        userAgent
      });
    }
    
    if (user.consentThirdParty !== consent.thirdParty) {
      historyEntries.push({
        userId: user.id,
        consentType: "thirdParty",
        status: consent.thirdParty,
        ipAddress,
        userAgent
      });
    }
    
    // Update user consent in database and create history entries in a transaction
    await prisma.$transaction([
      // Update user consent settings
      prisma.user.update({
        where: { email: session.user.email },
        data: {
          consentMarketing: consent.marketing,
          consentAnalytics: consent.analytics,
          consentThirdParty: consent.thirdParty,
          dataRetentionPeriod: dataRetentionPeriod || user.dataRetentionPeriod,
        },
      }),
      // Create history records for each changed consent
      ...historyEntries.map(entry => 
        prisma.consentHistory.create({ data: entry })
      )
    ]);
    
    // Return success response
    return NextResponse.json(
      { 
        message: "Préférences de consentement mises à jour avec succès",
        consent,
        dataRetentionPeriod,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating consent settings:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour des préférences de consentement." },
      { status: 500 }
    );
  }
} 