import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// GET /api/admin/specifications/[id] - Get a specific technical specification
export async function GET(request, { params }) {
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

    const specification = await prisma.technicalSpecification.findUnique({
      where: { id: params.id },
      include: {
        articles: {
          include: {
            article: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!specification) {
      return NextResponse.json(
        { message: "Specification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(specification);
  } catch (error) {
    console.error("Error fetching specification:", error);
    return NextResponse.json(
      { message: "Error fetching specification" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/specifications/[id] - Update a specific technical specification
export async function PUT(request, { params }) {
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
        { message: "You must be an admin to update specifications." },
        { status: 403 }
      );
    }

    const { name, description, isActive } = await request.json();

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    // Check if the specification exists
    const existingSpec = await prisma.technicalSpecification.findUnique({
      where: { id: params.id }
    });

    if (!existingSpec) {
      return NextResponse.json(
        { message: "Specification not found" },
        { status: 404 }
      );
    }

    // Check if another specification with same name exists (excluding current one)
    const duplicateSpec = await prisma.technicalSpecification.findFirst({
      where: { 
        name: name.trim(),
        id: { not: params.id }
      }
    });

    if (duplicateSpec) {
      return NextResponse.json(
        { message: "A specification with this name already exists." },
        { status: 400 }
      );
    }

    // Update the specification
    const updatedSpec = await prisma.technicalSpecification.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: isActive !== undefined ? isActive : existingSpec.isActive,
      },
    });

    return NextResponse.json(updatedSpec);
  } catch (error) {
    console.error("Error updating specification:", error);
    return NextResponse.json(
      { message: "Error updating specification" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/specifications/[id] - Delete a specific technical specification
export async function DELETE(request, { params }) {
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
        { message: "You must be an admin to delete specifications." },
        { status: 403 }
      );
    }

    // Check if the specification exists
    const existingSpec = await prisma.technicalSpecification.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    if (!existingSpec) {
      return NextResponse.json(
        { message: "Specification not found" },
        { status: 404 }
      );
    }

    // Check if specification is being used by articles
    if (existingSpec._count.articles > 0) {
      return NextResponse.json(
        { message: `Cannot delete specification. It is being used by ${existingSpec._count.articles} article(s).` },
        { status: 400 }
      );
    }

    // Delete the specification
    await prisma.technicalSpecification.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Specification deleted successfully" });
  } catch (error) {
    console.error("Error deleting specification:", error);
    return NextResponse.json(
      { message: "Error deleting specification" },
      { status: 500 }
    );
  }
}
