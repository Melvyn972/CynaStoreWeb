import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// GET /api/admin/contact-requests - Get all contact requests
export async function GET(request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You must be an admin to view contact requests." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const isRead = searchParams.get('isRead');

    let whereClause = {};
    if (isRead !== null && isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }

    const skip = (page - 1) * limit;

    const [contactRequests, totalCount] = await Promise.all([
      prisma.contactRequest.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.contactRequest.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      contactRequests,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
      stats: {
        total: await prisma.contactRequest.count(),
        unread: await prisma.contactRequest.count({ where: { isRead: false } }),
        read: await prisma.contactRequest.count({ where: { isRead: true } })
      }
    });

  } catch (error) {
    console.error("Error fetching contact requests:", error);
    return NextResponse.json(
      { message: "Error fetching contact requests" },
      { status: 500 }
    );
  }
}
