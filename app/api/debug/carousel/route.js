import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET() {
  try {
    // Test database connection and count carousel slides
    const [totalSlides, activeSlides] = await Promise.all([
      prisma.carouselSlide.count(),
      prisma.carouselSlide.count({ where: { isActive: true } }),
    ]);

    // Get first few slides for debugging
    const sampleSlides = await prisma.carouselSlide.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        image: true,
        isActive: true,
        displayOrder: true,
        createdAt: true,
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      database: 'connected',
      counts: {
        totalSlides,
        activeSlides,
      },
      sampleSlides,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
