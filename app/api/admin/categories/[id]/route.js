import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import path from "path";
import { writeFile, mkdir, unlink } from "fs/promises";

// Function to save uploaded files
async function saveFile(file) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Create upload directory if it doesn't exist
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // Directory already exists, continue
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = path.join(uploadDir, filename);
  
  await writeFile(filePath, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}

// Function to delete files
async function deleteFile(imagePath) {
  if (!imagePath) return;
  
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    await unlink(fullPath);
  } catch (error) {
    console.error("Error deleting file:", error);
    // File doesn't exist or cannot be deleted, continue
  }
}

// GET /api/admin/categories/[id] - Get a specific category
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
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
        { message: "You must be an admin to view categories." },
        { status: 403 }
      );
    }

    // Get the category
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/[id] - Update a specific category
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
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
        { message: "You must be an admin to update categories." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const currentImageUrl = formData.get('currentImageUrl');
    const imageFile = formData.get('image');
    const displayOrder = formData.get('displayOrder');
    const isActive = formData.get('isActive') === 'true';

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: "Category name is required." },
        { status: 400 }
      );
    }

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Process the image file if provided
    let imagePath = currentImageUrl;
    if (imageFile && imageFile.size > 0) {
      // Delete the old image if it exists
      if (existingCategory.image) {
        await deleteFile(existingCategory.image);
      }
      
      // Save the new image
      imagePath = await saveFile(imageFile);
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        image: imagePath,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "A category with this name already exists." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: "Error updating category" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete a specific category
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
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
        { message: "You must be an admin to delete categories." },
        { status: 403 }
      );
    }

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has articles
    if (existingCategory._count.articles > 0) {
      return NextResponse.json(
        { message: "Cannot delete category that contains articles. Please move or delete the articles first." },
        { status: 409 }
      );
    }

    // Delete the category image if it exists
    if (existingCategory.image) {
      await deleteFile(existingCategory.image);
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
}
