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

// Decline a company invitation
export async function POST(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const invitationId = params.invitationId;
    
    // Find the invitation
    const invitation = await prisma.companyInvitation.findUnique({
      where: { id: invitationId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            description: true,
          }
        }
      }
    });
    
    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404, headers: corsHeaders }
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
    
    // Decline invitation - update status
    await prisma.companyInvitation.update({
      where: { id: invitationId },
      data: { status: "DECLINED" },
    });
    
    return NextResponse.json(
      {
        success: true,
        message: `Vous avez refusé l'invitation à rejoindre ${invitation.company.name}`,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error declining invitation:", error);
    return NextResponse.json(
      { error: "Erreur lors du refus de l'invitation" },
      { status: 500, headers: corsHeaders }
    );
  }
} 