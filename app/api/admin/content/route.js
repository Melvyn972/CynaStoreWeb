import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { put } from "@vercel/blob";

// Function to save uploaded files
async function saveFile(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  const blob = await put(filename, buffer, {
    access: 'public',
  });
  
  return blob.url;
}

// GET /api/admin/content - Get all content blocks
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
        { message: "You must be an admin to view content blocks." },
        { status: 403 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const pageLocation = searchParams.get('pageLocation') || 'homepage';

    // Get all content blocks for specific page ordered by displayOrder
    const blocks = await prisma.contentBlock.findMany({
      where: { pageLocation },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Error fetching content blocks:", error);
    return NextResponse.json(
      { message: "Error fetching content blocks" },
      { status: 500 }
    );
  }
}

// POST /api/admin/content - Create a new content block
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
        { message: "You must be an admin to create content blocks." },
        { status: 403 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const blockType = formData.get('blockType');
    const pageLocation = formData.get('pageLocation');
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

    // Process the image file if provided
    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      imagePath = await saveFile(imageFile);
    }

    // Create the content block
    const block = await prisma.contentBlock.create({
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

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("Error creating content block:", error);
    return NextResponse.json(
      { message: "Error creating content block" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/content - Update display order of content blocks
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
        { message: "You must be an admin to update content blocks." },
        { status: 403 }
      );
    }

    const { blocks } = await request.json();

    // Update display order for all blocks
    await Promise.all(
      blocks.map((block) =>
        prisma.contentBlock.update({
          where: { id: block.id },
          data: { displayOrder: block.displayOrder },
        })
      )
    );

    return NextResponse.json({ message: "Display order updated successfully" });
  } catch (error) {
    console.error("Error updating content blocks order:", error);
    return NextResponse.json(
      { message: "Error updating content blocks order" },
      { status: 500 }
    );
  }
}
