import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

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

// GET /api/admin/carousel - Get all carousel slides
export async function GET(request) {
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
        { message: "You must be an admin to view carousel slides." },
        { status: 403 }
      );
    }

    // Get all carousel slides ordered by displayOrder
    const slides = await prisma.carouselSlide.findMany({
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching carousel slides:", error);
    return NextResponse.json(
      { message: "Error fetching carousel slides" },
      { status: 500 }
    );
  }
}

// POST /api/admin/carousel - Create a new carousel slide
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
        { message: "You must be an admin to create carousel slides." },
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
    const imageFile = formData.get('image');
    const displayOrder = formData.get('displayOrder');
    const isActive = formData.get('isActive') === 'true';

    // Validate required fields
    if (!title || !imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { message: "Title and image are required." },
        { status: 400 }
      );
    }

    // Process the image file
    const imagePath = await saveFile(imageFile);

    // Create the carousel slide
    const slide = await prisma.carouselSlide.create({
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

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel slide:", error);
    return NextResponse.json(
      { message: "Error creating carousel slide" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/carousel - Update display order of slides
export async function PUT(request) {
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
        { message: "You must be an admin to update carousel slides." },
        { status: 403 }
      );
    }

    const { slides } = await request.json();

    // Update display order for all slides
    await Promise.all(
      slides.map((slide) =>
        prisma.carouselSlide.update({
          where: { id: slide.id },
          data: { displayOrder: slide.displayOrder },
        })
      )
    );

    return NextResponse.json({ message: "Display order updated successfully" });
  } catch (error) {
    console.error("Error updating carousel slides order:", error);
    return NextResponse.json(
      { message: "Error updating carousel slides order" },
      { status: 500 }
    );
  }
}
