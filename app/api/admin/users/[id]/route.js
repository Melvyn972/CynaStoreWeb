import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

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

// Helper function to delete an old avatar file
async function deleteFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/avatars/')) return;
  
  const filename = imageUrl.split('/').pop();
  const path = join(process.cwd(), 'public/uploads/avatars', filename);
  
  // Check if file exists before attempting to delete
  if (existsSync(path)) {
    await unlink(path);
  }
}

// GET /api/admin/users/[id] - Fetch a specific user
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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, id: true }
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You must be an admin to view user details." },
        { status: 403 }
      );
    }

    // Fetch user with purchases
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                image: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch all articles to provide context for purchase selection
    const allArticles = await prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        price: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format the response
    const response = {
      ...user,
      purchasedArticles: user.purchases.map(p => p.article.id),
      allArticles
    };

    // Remove sensitive data
    delete response.password;
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update a specific user
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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, id: true }
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You must be an admin to update users." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const articlesJson = formData.get('articles');
    const currentImageUrl = formData.get('currentImageUrl');
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

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        purchases: true
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (userWithEmail) {
        return NextResponse.json(
          { message: "This email is already in use by another user." },
          { status: 400 }
        );
      }
    }

    // Prevent changing the last admin's role
    if (existingUser.role === "ADMIN" && role !== "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot change the role of the last admin user." },
          { status: 400 }
        );
      }
    }

    // Process the avatar file if provided
    let imagePath = currentImageUrl;
    if (avatarFile && avatarFile.size > 0) {
      // Delete the old image if it exists
      if (existingUser.image) {
        await deleteFile(existingUser.image);
      }
      
      // Save the new image
      imagePath = await saveFile(avatarFile);
    }

    // Hash password if provided
    let updateData = {
      name,
      email,
      image: imagePath,
      role,
    };

    if (password) {
      // For demonstration - if your app uses credentials provider,
      // you would update the password field in your user model
      // updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the user and handle purchases in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the user
      const updatedUser = await tx.user.update({
        where: { id },
        data: updateData,
      });
      
      // Get current user purchases
      const currentPurchaseIds = existingUser.purchases.map(p => p.articleId);
      
      // Find purchases to add and remove
      const purchasesToAdd = selectedArticles.filter(id => !currentPurchaseIds.includes(id));
      const purchasesToRemove = currentPurchaseIds.filter(id => !selectedArticles.includes(id));
      
      // Add new purchases
      if (purchasesToAdd.length > 0) {
        await tx.purchase.createMany({
          data: purchasesToAdd.map(articleId => ({
            userId: id,
            articleId,
          }))
        });
      }
      
      // Remove purchases that are no longer selected
      if (purchasesToRemove.length > 0) {
        await tx.purchase.deleteMany({
          where: {
            userId: id,
            articleId: { in: purchasesToRemove }
          }
        });
      }
      
      return updatedUser;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete a specific user
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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, id: true }
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You must be an admin to delete users." },
        { status: 403 }
      );
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (id === currentUser.id) {
      return NextResponse.json(
        { message: "You cannot delete your own account." },
        { status: 400 }
      );
    }

    // Prevent deleting the last admin
    if (existingUser.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot delete the last admin user." },
          { status: 400 }
        );
      }
    }

    // Delete the associated avatar file if it exists
    if (existingUser.image) {
      await deleteFile(existingUser.image);
    }

    // Delete the user
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
} 