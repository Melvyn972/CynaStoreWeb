import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// GET /api/public/categories - Get active categories for public use
export async function GET(request) {
  try {
    // Get all active categories ordered by displayOrder
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        image: true,
        displayOrder: true,
        _count: {
          select: { articles: true }
        }
      }
    });

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=120',
      }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}
