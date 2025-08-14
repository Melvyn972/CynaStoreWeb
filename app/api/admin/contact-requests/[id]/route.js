import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

// GET /api/admin/contact-requests/[id] - Get a specific contact request
export async function GET(request, { params }) {
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
        { message: "You must be an admin to view contact requests." },
        { status: 403 }
      );
    }

    const contactRequest = await prisma.contactRequest.findUnique({
      where: { id: params.id }
    });

    if (!contactRequest) {
      return NextResponse.json(
        { message: "Contact request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contactRequest);

  } catch (error) {
    console.error("Error fetching contact request:", error);
    return NextResponse.json(
      { message: "Error fetching contact request" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/contact-requests/[id] - Update contact request (mark as read/unread)
export async function PUT(request, { params }) {
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
        { message: "You must be an admin to update contact requests." },
        { status: 403 }
      );
    }

    const { isRead } = await request.json();

    const contactRequest = await prisma.contactRequest.update({
      where: { id: params.id },
      data: { isRead }
    });

    return NextResponse.json(contactRequest);

  } catch (error) {
    console.error("Error updating contact request:", error);
    return NextResponse.json(
      { message: "Error updating contact request" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contact-requests/[id] - Delete contact request
export async function DELETE(request, { params }) {
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
        { message: "You must be an admin to delete contact requests." },
        { status: 403 }
      );
    }

    await prisma.contactRequest.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Contact request deleted successfully" });

  } catch (error) {
    console.error("Error deleting contact request:", error);
    return NextResponse.json(
      { message: "Error deleting contact request" },
      { status: 500 }
    );
  }
}
