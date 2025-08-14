import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

async function saveFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const originalName = file.name;
  const extension = originalName.split('.').pop();
  const filename = `${uuidv4()}.${extension}`;
  const path = join(process.cwd(), 'public/uploads', filename);
  await writeFile(path, buffer);
  return `/uploads/${filename}`;
}

async function deleteFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  
  try {
    const filename = imageUrl.replace('/uploads/', '');
    const fullPath = join(process.cwd(), 'public/uploads', filename);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

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
        { message: "You must be an admin to view articles." },
        { status: 403 }
      );
    }

    // Get the article with relations
    const article = await prisma.articles.findUnique({
      where: { id },
      include: {
        categoryObj: true,
        specifications: {
          include: {
            technicalSpecification: true
          }
        }
      }
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
    const categoryId = formData.get('categoryId');
    const imageFile = formData.get('image');
    const price = formData.get('price');
    const stock = formData.get('stock');
    const subscriptionDuration = formData.get('subscriptionDuration');
    const carouselImageCount = parseInt(formData.get('carouselImageCount') || '0');
    const currentImagesJson = formData.get('currentImages');
    const specificationsJson = formData.get('specifications');

    // Validate required fields
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { message: "Title, description, and categoryId are required." },
        { status: 400 }
      );
    }

    // Check if the article exists
    const existingArticle = await prisma.articles.findUnique({
      where: { id },
      include: {
        specifications: true
      }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // Vérifier que la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    // Process the main image file if provided
    let imagePath = existingArticle.image;
    if (imageFile && imageFile.size > 0) {
      // Delete the old image if it exists
      if (existingArticle.image) {
        await deleteFile(existingArticle.image);
      }
      
      // Save the new image
      imagePath = await saveFile(imageFile);
    }

    // Process current images (images to keep)
    let currentImages = [];
    if (currentImagesJson) {
      try {
        currentImages = JSON.parse(currentImagesJson);
      } catch (error) {
        console.error('Error parsing current images:', error);
      }
    }

    // Process new carousel images
    const newCarouselImages = [];
    for (let i = 0; i < carouselImageCount; i++) {
      const carouselImageFile = formData.get(`carouselImage_${i}`);
      const carouselImageAlt = formData.get(`carouselImageAlt_${i}`) || '';
      
      if (carouselImageFile && carouselImageFile.size > 0) {
        const imagePath = await saveFile(carouselImageFile);
        newCarouselImages.push({
          url: imagePath,
          alt: carouselImageAlt
        });
      }
    }

    // Combine current images with new images
    const allCarouselImages = [...currentImages, ...newCarouselImages];

    // Delete old carousel images that are no longer used
    if (existingArticle.images) {
      try {
        const oldImages = JSON.parse(existingArticle.images);
        if (Array.isArray(oldImages)) {
          for (const oldImg of oldImages) {
            const imageUrl = typeof oldImg === 'object' ? oldImg.url : oldImg;
            // Check if this image is still in the current images
            const isStillUsed = currentImages.some(img => 
              (typeof img === 'object' ? img.url : img) === imageUrl
            );
            if (!isStillUsed) {
              await deleteFile(imageUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error processing old images:', error);
      }
    }

    // Parse specifications if provided
    let specifications = [];
    if (specificationsJson) {
      try {
        specifications = JSON.parse(specificationsJson);
      } catch (error) {
        console.error('Error parsing specifications:', error);
      }
    }

    // Update the article
    const updatedArticle = await prisma.articles.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        category: category.name, // Keep old category field for backward compatibility
        image: imagePath,
        images: allCarouselImages.length > 0 ? JSON.stringify(allCarouselImages) : null,
        price: price ? parseFloat(price) : null,
        stock: stock ? parseInt(stock) : 0,
        subscriptionDuration: subscriptionDuration || null,
      },
      include: {
        categoryObj: true
      }
    });

    // Update article-specification associations
    // First, delete existing associations
    await prisma.articleSpecification.deleteMany({
      where: { articleId: id }
    });

    // Then, create new associations
    if (specifications.length > 0) {
      await Promise.all(
        specifications.map(specId =>
          prisma.articleSpecification.create({
            data: {
              articleId: id,
              technicalSpecificationId: specId
            }
          })
        )
      );
    }

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

    // Delete associated image files
    if (existingArticle.image) {
      await deleteFile(existingArticle.image);
    }

    // Delete carousel images
    if (existingArticle.images) {
      try {
        const images = JSON.parse(existingArticle.images);
        if (Array.isArray(images)) {
          for (const img of images) {
            const imageUrl = typeof img === 'object' ? img.url : img;
            await deleteFile(imageUrl);
          }
        }
      } catch (error) {
        console.error('Error deleting carousel images:', error);
      }
    }

    // Delete the article (this will cascade delete specifications and other relations)
    await prisma.articles.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Error deleting article" },
      { status: 500 }
    );
  }
}