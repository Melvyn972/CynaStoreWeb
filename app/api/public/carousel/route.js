import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/public/carousel - Get active carousel slides for public use
export async function GET(request) {
  try {
    console.log("🎠 Fetching carousel slides...");
    
    // Check if database connection is available
    if (!prisma) {
      console.error("❌ Prisma client not available");
      return NextResponse.json(
        { message: "Database not available", slides: [] },
        { status: 503 }
      );
    }

    // Get all active carousel slides ordered by displayOrder
    const slides = await prisma.carouselSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        image: true,
        buttonText: true,
        buttonLink: true,
        displayOrder: true
      }
    });

    console.log(`✅ Found ${slides.length} active carousel slides`);

    // Return slides with proper cache headers for dynamic content
    return NextResponse.json(slides, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error("❌ Error fetching carousel slides:", error);
    
    // Return empty array as fallback instead of error
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  }
}
