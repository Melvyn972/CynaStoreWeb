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
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const subscriptionDuration = searchParams.get('subscriptionDuration');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const exactMatch = searchParams.get('exactMatch') === 'true';
    
    let whereClause = {};
    let andConditions = [];
    
    // Search functionality - SQLite compatible
    if (query.trim()) {
      if (exactMatch) {
        whereClause.OR = [
          { title: { equals: query } },
          { description: { equals: query } },
          { category: { equals: query } },
        ];
      } else {
        // Recherche "commence par" si le query commence par ^
        if (query.startsWith('^')) {
          const searchTerm = query.substring(1);
          whereClause.OR = [
            { title: { startsWith: searchTerm } },
            { description: { startsWith: searchTerm } },
            { category: { startsWith: searchTerm } },
          ];
        } else {
          // Recherche normale (contient)
          whereClause.OR = [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
          ];
        }
      }
    }
    
    // Filter by category
    if (category && category !== 'all') {
      andConditions.push({ category: { equals: category } });
    }
    
    // Filter by price range
    if (minPrice) {
      andConditions.push({ price: { gte: parseFloat(minPrice) } });
    }
    if (maxPrice) {
      andConditions.push({ price: { lte: parseFloat(maxPrice) } });
    }
    
    // Filter by stock availability
    if (inStock === 'true') {
      andConditions.push({ stock: { gt: 0 } });
    } else if (inStock === 'false') {
      andConditions.push({ stock: { lte: 0 } });
    }
    
    // Filter by subscription duration
    if (subscriptionDuration && subscriptionDuration !== 'all') {
      andConditions.push({ subscriptionDuration: { equals: subscriptionDuration } });
    }
    
    // Combine search with filters
    if (andConditions.length > 0) {
      if (whereClause.OR) {
        whereClause = {
          AND: [
            { OR: whereClause.OR },
            ...andConditions
          ]
        };
      } else {
        whereClause = {
          AND: andConditions
        };
      }
    }

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case 'price':
        orderBy = { price: sortOrder };
        break;
      case 'title':
        orderBy = { title: sortOrder };
        break;
      case 'stock':
        orderBy = { stock: sortOrder };
        break;
      case 'category':
        orderBy = { category: sortOrder };
        break;
      case 'subscriptionDuration':
        orderBy = { subscriptionDuration: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get articles with pagination - optimisé avec select
    const [articles, totalCount] = await Promise.all([
      prisma.articles.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
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
          }
        }
      }),
      prisma.articles.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    
    return NextResponse.json({
      articles,
      query,
      filters: {
        category,
        minPrice,
        maxPrice,
        inStock,
        exactMatch,
        sortBy,
        sortOrder
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to search articles:', error);
    return NextResponse.json(
      { message: 'Failed to search articles' },
      { status: 500, headers: corsHeaders }
    );
  }
} 