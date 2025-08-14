import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

export async function GET(request) {
  try {
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
        { message: "You must be an admin to view specifications." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let whereClause = {};
    if (!includeInactive) {
      whereClause.isActive = true;
    }

    const specifications = await prisma.technicalSpecification.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    return NextResponse.json(specifications);
  } catch (error) {
    console.error("Error fetching specifications:", error);
    return NextResponse.json(
      { message: "Error fetching specifications" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
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
        { message: "You must be an admin to create specifications." },
        { status: 403 }
      );
    }

    const { name, description, isActive } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    const existingSpec = await prisma.technicalSpecification.findUnique({
      where: { name: name.trim() }
    });

    if (existingSpec) {
      return NextResponse.json(
        { message: "A specification with this name already exists." },
        { status: 400 }
      );
    }

    const specification = await prisma.technicalSpecification.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(specification, { status: 201 });
  } catch (error) {
    console.error("Error creating specification:", error);
    return NextResponse.json(
      { message: "Error creating specification" },
      { status: 500 }
    );
  }
}
