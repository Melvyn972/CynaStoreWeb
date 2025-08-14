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

// GET /api/admin/carousel/[id] - Get a specific carousel slide
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
        { message: "You must be an admin to view carousel slides." },
        { status: 403 }
      );
    }

    // Get the carousel slide
    const slide = await prisma.carouselSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      return NextResponse.json(
        { message: "Carousel slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error fetching carousel slide:", error);
    return NextResponse.json(
      { message: "Error fetching carousel slide" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/carousel/[id] - Update a specific carousel slide
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
        { message: "You must be an admin to update carousel slides." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const title = formData.get('title');
    const subtitle = formData.get('subtitle');
    const description = formData.get('description');
    const buttonText = formData.get('buttonText');
    const buttonLink = formData.get('buttonLink');
    const currentImageUrl = formData.get('currentImageUrl');
    const imageFile = formData.get('image');
    const displayOrder = formData.get('displayOrder');
    const isActive = formData.get('isActive') === 'true';

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { message: "Title is required." },
        { status: 400 }
      );
    }

    // Check if the slide exists
    const existingSlide = await prisma.carouselSlide.findUnique({
      where: { id }
    });

    if (!existingSlide) {
      return NextResponse.json(
        { message: "Carousel slide not found" },
        { status: 404 }
      );
    }

    // Process the image file if provided
    let imagePath = currentImageUrl;
    if (imageFile && imageFile.size > 0) {
      // Delete the old image if it exists
      if (existingSlide.image) {
        await deleteFile(existingSlide.image);
      }
      
      // Save the new image
      imagePath = await saveFile(imageFile);
    }

    // Update the carousel slide
    const updatedSlide = await prisma.carouselSlide.update({
      where: { id },
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        image: imagePath,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive,
      },
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error("Error updating carousel slide:", error);
    return NextResponse.json(
      { message: "Error updating carousel slide" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/carousel/[id] - Delete a specific carousel slide
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
        { message: "You must be an admin to delete carousel slides." },
        { status: 403 }
      );
    }

    // Check if the slide exists
    const existingSlide = await prisma.carouselSlide.findUnique({
      where: { id }
    });

    if (!existingSlide) {
      return NextResponse.json(
        { message: "Carousel slide not found" },
        { status: 404 }
      );
    }

    // Delete the slide image if it exists
    if (existingSlide.image) {
      await deleteFile(existingSlide.image);
    }

    // Delete the carousel slide
    await prisma.carouselSlide.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Carousel slide deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel slide:", error);
    return NextResponse.json(
      { message: "Error deleting carousel slide" },
      { status: 500 }
    );
  }
}
