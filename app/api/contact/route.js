import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// POST /api/contact - Submit contact form
export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Create contact request
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({
      message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      id: contactRequest.id
    });

  } catch (error) {
    console.error("Error creating contact request:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
