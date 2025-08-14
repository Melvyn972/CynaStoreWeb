import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// GET /api/public/carousel - Get active carousel slides for public use
export async function GET(request) {
  try {
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

    return NextResponse.json(slides, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
      }
    });
  } catch (error) {
    console.error("Error fetching carousel slides:", error);
    return NextResponse.json(
      { message: "Error fetching carousel slides" },
      { status: 500 }
    );
  }
}
