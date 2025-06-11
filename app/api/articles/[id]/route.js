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

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get the article by ID
    const article = await prisma.articles.findUnique({
      where: { id }
    });

    if (!article) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(article, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json(
      { message: 'Failed to fetch article' },
      { status: 500, headers: corsHeaders }
    );
  }
} 