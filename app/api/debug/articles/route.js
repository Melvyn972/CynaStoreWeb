import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET() {
  try {
    // Test database connection and count articles
    const [articlesCount, categoriesCount, usersCount] = await Promise.all([
      prisma.articles.count(),
      prisma.category.count(),
      prisma.user.count(),
    ]);

    // Get first few articles for debugging
    const sampleArticles = await prisma.articles.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        price: true,
        image: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      database: 'connected',
      counts: {
        articles: articlesCount,
        categories: categoriesCount,
        users: usersCount,
      },
      sampleArticles,
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
