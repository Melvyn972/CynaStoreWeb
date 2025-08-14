import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// GET /api/public/content - Get active content blocks for public use
export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const pageLocation = searchParams.get('pageLocation') || 'homepage';

    // Get all active content blocks for specific page ordered by displayOrder
    const blocks = await prisma.contentBlock.findMany({
      where: { 
        pageLocation, 
        isActive: true 
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return NextResponse.json(
      { message: "Error fetching content blocks" },
      { status: 500 }
    );
  }
}
