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

// GET /api/admin/content/[id] - Get a specific content block
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
        { message: "You must be an admin to view content blocks." },
        { status: 403 }
      );
    }

    // Get the content block
    const block = await prisma.contentBlock.findUnique({
      where: { id }
    });

    if (!block) {
      return NextResponse.json(
        { message: "Content block not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(block);
  } catch (error) {
    console.error("Error fetching content block:", error);
    return NextResponse.json(
      { message: "Error fetching content block" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/content/[id] - Update a specific content block
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
        { message: "You must be an admin to update content blocks." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const blockType = formData.get('blockType');
    const pageLocation = formData.get('pageLocation');
    const currentImageUrl = formData.get('currentImageUrl');
    const imageFile = formData.get('image');
    const displayOrder = formData.get('displayOrder');
    const isActive = formData.get('isActive') === 'true';

    // Validate required fields
    if (!title || !content || !blockType) {
      return NextResponse.json(
        { message: "Title, content, and block type are required." },
        { status: 400 }
      );
    }

    // Check if the block exists
    const existingBlock = await prisma.contentBlock.findUnique({
      where: { id }
    });

    if (!existingBlock) {
      return NextResponse.json(
        { message: "Content block not found" },
        { status: 404 }
      );
    }

    // Process the image file if provided
    let imagePath = currentImageUrl;
    if (imageFile && imageFile.size > 0) {
      // Delete the old image if it exists
      if (existingBlock.image) {
        await deleteFile(existingBlock.image);
      }
      
      // Save the new image
      imagePath = await saveFile(imageFile);
    }

    // Update the content block
    const updatedBlock = await prisma.contentBlock.update({
      where: { id },
      data: {
        title,
        content,
        blockType,
        pageLocation: pageLocation || 'homepage',
        image: imagePath,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive,
      },
    });

    return NextResponse.json(updatedBlock);
  } catch (error) {
    console.error("Error updating content block:", error);
    return NextResponse.json(
      { message: "Error updating content block" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/content/[id] - Delete a specific content block
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
        { message: "You must be an admin to delete content blocks." },
        { status: 403 }
      );
    }

    // Check if the block exists
    const existingBlock = await prisma.contentBlock.findUnique({
      where: { id }
    });

    if (!existingBlock) {
      return NextResponse.json(
        { message: "Content block not found" },
        { status: 404 }
      );
    }

    // Delete the block image if it exists
    if (existingBlock.image) {
      await deleteFile(existingBlock.image);
    }

    // Delete the content block
    await prisma.contentBlock.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Content block deleted successfully" });
  } catch (error) {
    console.error("Error deleting content block:", error);
    return NextResponse.json(
      { message: "Error deleting content block" },
      { status: 500 }
    );
  }
}
