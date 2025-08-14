import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const specifications = await prisma.technicalSpecification.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true,
      }
    });

    return NextResponse.json(specifications, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch specifications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch specifications' },
      { status: 500, headers: corsHeaders }
    );
  }
}
