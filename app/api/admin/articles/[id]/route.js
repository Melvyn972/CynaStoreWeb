import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

// Helper function to process file uploads
async function saveFile(file) {
  // Create an array buffer from the file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const originalName = file.name;
  const extension = originalName.split('.').pop();
  const filename = `${uuidv4()}.${extension}`;
  
  // Define path where the file will be saved
  const path = join(process.cwd(), 'public/uploads', filename);

  // Write the file to the filesystem
  await writeFile(path, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}

// Helper function to delete an old image file
async function deleteFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  
  const filename = imageUrl.split('/').pop();
  const path = join(process.cwd(), 'public/uploads', filename);
  
  // Check if file exists before attempting to delete
  if (existsSync(path)) {
    await unlink(path);
  }
}

// GET /api/admin/articles/[id] - Get a specific article
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
        { message: "You must be an admin to view this article." },
        { status: 403 }
      );
    }

    // Get the article by ID
    const article = await prisma.articles.findUnique({
      where: { id }
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { message: "Error fetching article" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/articles/[id] - Update a specific article
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
        { message: "You must be an admin to update articles." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const currentImageUrl = formData.get('currentImageUrl');
    const imageFile = formData.get('image');
    const price = formData.get('price');

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { message: "Title, description, and category are required." },
        { status: 400 }
      );
    }

    // Check if the article exists
    const existingArticle = await prisma.articles.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // Process the image file if provided
    let imagePath = currentImageUrl;
    if (imageFile && imageFile.size > 0) {
      // Delete the old image if it exists
      if (existingArticle.image) {
        await deleteFile(existingArticle.image);
      }
      
      // Save the new image
      imagePath = await saveFile(imageFile);
    }

    // Update the article
    const updatedArticle = await prisma.articles.update({
      where: { id },
      data: {
        title,
        description,
        category,
        image: imagePath,
        price: price ? parseFloat(price) : null,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: "Error updating article" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/articles/[id] - Delete a specific article
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
        { message: "You must be an admin to delete articles." },
        { status: 403 }
      );
    }

    // Check if the article exists
    const existingArticle = await prisma.articles.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // Delete the associated image file if it exists
    if (existingArticle.image) {
      await deleteFile(existingArticle.image);
    }

    // Delete the article
    await prisma.articles.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Error deleting article" },
      { status: 500 }
    );
  }
} 