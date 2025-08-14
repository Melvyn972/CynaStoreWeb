import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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
        { message: "You must be an admin to create articles." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const categoryId = formData.get('categoryId');
    const imageFile = formData.get('image');
    const price = formData.get('price');
    const stock = formData.get('stock');
    const subscriptionDuration = formData.get('subscriptionDuration');
    const carouselImageCount = parseInt(formData.get('carouselImageCount') || '0');
    const specificationsJson = formData.get('specifications');

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { message: "Title, description, and categoryId are required." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 }
      );
    }

    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      imagePath = await saveFile(imageFile);
    }

    const carouselImages = [];
    for (let i = 0; i < carouselImageCount; i++) {
      const carouselImageFile = formData.get(`carouselImage_${i}`);
      const carouselImageAlt = formData.get(`carouselImageAlt_${i}`) || '';
      
      if (carouselImageFile && carouselImageFile.size > 0) {
        const imagePath = await saveFile(carouselImageFile);
        carouselImages.push({
          url: imagePath,
          alt: carouselImageAlt
        });
      }
    }

    let specifications = [];
    if (specificationsJson) {
      try {
        specifications = JSON.parse(specificationsJson);
      } catch (error) {
        console.error('Error parsing specifications:', error);
      }
    }

    const article = await prisma.articles.create({
      data: {
        title,
        description,
        categoryId,
        category: category.name,
        image: imagePath,
        images: carouselImages.length > 0 ? JSON.stringify(carouselImages) : null,
        price: price ? parseFloat(price) : null,
        stock: stock ? parseInt(stock) : 0,
        subscriptionDuration: subscriptionDuration || null,
      },
      include: {
        categoryObj: true
      }
    });

    if (specifications.length > 0) {
      await Promise.all(
        specifications.map(specId =>
          prisma.articleSpecification.create({
            data: {
              articleId: article.id,
              technicalSpecificationId: specId
            }
          })
        )
      );
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { message: "Error creating article" },
      { status: 500 }
    );
  }
}

export async function GET(request) {

  console.log(request);
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
        { message: "You must be an admin to view all articles." },
        { status: 403 }
      );
    }

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