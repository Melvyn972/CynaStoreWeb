import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let whereClause = {};
    
    // Filter by IDs
    if (ids) {
      const idList = ids.split(',');
      whereClause.id = {
        in: idList,
      };
    }
    
    // Filter by category
    if (category) {
      whereClause.category = category;
    }
    
    // Search
    if (search) {
      whereClause.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }
    
    const articles = await prisma.articles.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { message: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create a new article (admin only)
export async function POST(request) {
  try {
    const { title, description, image, category, price } = await request.json();
    
    // TODO: Add authentication and authorization checks
    
    const article = await prisma.articles.create({
      data: {
        title,
        description,
        image,
        category,
        price,
      },
    });
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json(
      { message: 'Failed to create article' },
      { status: 500 }
    );
  }
} 