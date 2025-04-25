import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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

// POST /api/admin/articles - Create a new article
export async function POST(request) {
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
        { message: "You must be an admin to create articles." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const imageFile = formData.get('image');
    const price = formData.get('price');

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { message: "Title, description, and category are required." },
        { status: 400 }
      );
    }

    // Process the image file if provided
    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      imagePath = await saveFile(imageFile);
    }

    // Create the article
    const article = await prisma.articles.create({
      data: {
        title,
        description,
        category,
        image: imagePath,
        price: price ? parseFloat(price) : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { message: "Error creating article" },
      { status: 500 }
    );
  }
}

// GET /api/admin/articles - Get all articles
export async function GET(request) {

  console.log(request);
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
        { message: "You must be an admin to view all articles." },
        { status: 403 }
      );
    }

    // Get all articles
    const articles = await prisma.articles.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Error fetching articles" },
      { status: 500 }
    );
  }
} 