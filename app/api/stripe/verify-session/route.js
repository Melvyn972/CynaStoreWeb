import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import Stripe from "stripe";
import prisma from "@/libs/prisma";

export async function GET(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to verify a session" },
        { status: 401 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Retrieve the Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (checkoutSession.client_reference_id !== session.user.id) {
      // This checkout session doesn't belong to the current user
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Check if payment was successful
    const paymentSuccessful = checkoutSession.payment_status === "paid";
    
    // Check if purchases exist in database
    let purchases = [];
    if (paymentSuccessful) {
      purchases = await prisma.purchase.findMany({
        where: {
          userId: session.user.id,
          orderId: sessionId
        },
        include: {
          article: true
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      paymentSuccessful,
      session: {
        id: checkoutSession.id,
        paymentStatus: checkoutSession.payment_status,
        amountTotal: checkoutSession.amount_total / 100 // Convert from cents to euros
      },
      purchases: purchases.map(p => ({
        id: p.id,
        articleTitle: p.article.title,
        quantity: p.quantity,
        purchaseDate: p.purchaseDate
      }))
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 