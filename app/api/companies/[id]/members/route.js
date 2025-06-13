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

// Get all members of a company
export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const companyId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;
    
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
    
    // Check if the user is a member of the company
    const isMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!isMember && company.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à voir les membres de cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Get all members of the company
    const members = await prisma.companyMember.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });

    // Format members for mobile app
    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      role: member.role.toLowerCase(),
      joinedAt: member.joinedAt,
    }));

    // Get total count for pagination
    const totalCount = await prisma.companyMember.count({
      where: { companyId },
    });
    
    return NextResponse.json({
      members: formattedMembers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching company members:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des membres de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete a member from a company
export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const companyId = params.id;
    const { memberId } = await request.json();
    
    if (!memberId) {
      return NextResponse.json(
        { error: "L'ID du membre est requis" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
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
        { error: "Vous devez être propriétaire ou administrateur pour supprimer des membres" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Check if trying to remove the owner
    const memberToRemove = await prisma.companyMember.findUnique({
      where: {
        id: memberId,
      },
    });
    
    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Membre non trouvé" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    if (memberToRemove.userId === company.ownerId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer le propriétaire de l'entreprise" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Delete member
    await prisma.companyMember.delete({
      where: {
        id: memberId,
      },
    });
    
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error removing company member:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du membre de l'entreprise" },
      { status: 500, headers: corsHeaders }
    );
  }
} 