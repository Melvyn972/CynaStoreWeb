import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Helper function to process avatar uploads
async function saveFile(file) {
  // Create an array buffer from the file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const originalName = file.name;
  const extension = originalName.split('.').pop();
  const filename = `${uuidv4()}.${extension}`;
  
  // Define path where the file will be saved
  const path = join(process.cwd(), 'public/uploads/avatars', filename);

  // Write the file to the filesystem
  await writeFile(path, buffer);

  // Return the public URL
  return `/uploads/avatars/${filename}`;
}

// GET /api/admin/users - Get all users
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
        { message: "You must be an admin to view all users." },
        { status: 403 }
      );
    }

    // Get all users with their purchase counts
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { purchases: true }
        }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You must be an admin to create users." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    const articlesJson = formData.get('articles');
    const avatarFile = formData.get('avatar');

    // Parse selected articles
    let selectedArticles = [];
    if (articlesJson) {
      try {
        selectedArticles = JSON.parse(articlesJson);
      } catch (e) {
        console.error("Error parsing articles JSON:", e);
      }
    }

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 400 }
      );
    }

    // Process the avatar file if provided
    let avatarPath = null;
    if (avatarFile && avatarFile.size > 0) {
      avatarPath = await saveFile(avatarFile);
    }

    // Create the user with transaction to handle purchases
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          image: avatarPath,
          role: role || "USER",
          // password: hashedPassword, // Uncomment if using credentials provider
        },
      });
      
      // Create purchase records if any articles are selected
      if (selectedArticles.length > 0) {
        const purchaseData = selectedArticles.map(articleId => ({
          userId: user.id,
          articleId,
        }));
        
        await tx.purchase.createMany({
          data: purchaseData
        });
      }
      
      return user;
    });

    // Return the user without sensitive data
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
} 