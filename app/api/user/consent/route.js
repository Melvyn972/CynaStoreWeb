import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/libs/auth-middleware";
import prisma from "@/libs/prisma";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// Get current consent settings
export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Get user consent data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        consentMarketing: true,
        consentAnalytics: true,
        consentThirdParty: true,
        dataRetentionPeriod: true,
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Get consent history for the user
    const consentHistory = await prisma.consentHistory.findMany({
      where: { userId: userData.id },
      orderBy: { timestamp: 'desc' },
      take: 50, // Get the latest 50 records
    });
    
    // Format consent data
    const consent = {
      marketing: userData.consentMarketing,
      analytics: userData.consentAnalytics,
      thirdParty: userData.consentThirdParty,
    };
    
    // Return consent data and history
    return NextResponse.json({
      consent,
      dataRetentionPeriod: userData.dataRetentionPeriod,
      history: consentHistory
    }, { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error("Error retrieving consent settings:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la récupération des préférences de consentement." },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update consent settings
export async function PUT(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Parse request body
    const { consent, dataRetentionPeriod } = await request.json();
    
    // Get the current user data from the database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        consentMarketing: true,
        consentAnalytics: true,
        consentThirdParty: true,
        dataRetentionPeriod: true,
      }
    });
    
    if (!userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get IP address and user agent from the request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(/, /)[0] : "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";
    
    // Create history entries for any changed consents
    const historyEntries = [];
    
    if (userData.consentMarketing !== consent.marketing) {
      historyEntries.push({
        userId: userData.id,
        consentType: "marketing",
        status: consent.marketing,
        ipAddress,
        userAgent
      });
    }
    
    if (userData.consentAnalytics !== consent.analytics) {
      historyEntries.push({
        userId: userData.id,
        consentType: "analytics",
        status: consent.analytics,
        ipAddress,
        userAgent
      });
    }
    
    if (userData.consentThirdParty !== consent.thirdParty) {
      historyEntries.push({
        userId: userData.id,
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
        where: { id: user.id },
        data: {
          consentMarketing: consent.marketing,
          consentAnalytics: consent.analytics,
          consentThirdParty: consent.thirdParty,
          dataRetentionPeriod: dataRetentionPeriod || userData.dataRetentionPeriod,
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
        dataRetentionPeriod: dataRetentionPeriod || userData.dataRetentionPeriod,
      },
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error("Error updating consent settings:", error);
    
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour des préférences de consentement." },
      { status: 500, headers: corsHeaders }
    );
  }
} 