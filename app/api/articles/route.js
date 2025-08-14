import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
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
    
    // Search - PostgreSQL compatible
    if (search) {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive', // PostgreSQL case-insensitive search
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive', // PostgreSQL case-insensitive search
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get articles with pagination and relations
    const [articles, totalCount] = await Promise.all([
      prisma.articles.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          image: true,
          images: true,
          stock: true,
          subscriptionDuration: true,
          createdAt: true,
          categoryObj: {
            select: {
              id: true,
              name: true
            }
          },
          specifications: {
            select: {
              technicalSpecification: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.articles.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    
    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { message: 'Failed to fetch articles' },
      { status: 500, headers: corsHeaders }
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
    
    return NextResponse.json(article, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json(
      { message: 'Failed to create article' },
      { status: 500, headers: corsHeaders }
    );
  }
} 