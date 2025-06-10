import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Check if this is a company purchase
      if (session.metadata?.companyId) {
        await handleCompanyPaymentSuccess(session);
      } else {
        await handlePaymentSuccess(session);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(session) {
  const userId = session.metadata.userId;
  const items = JSON.parse(session.metadata.items || "{}");

  if (!userId || !items || Object.keys(items).length === 0) {
    throw new Error("Invalid session metadata");
  }

  // Record the purchases in the database
  for (const [articleId, quantity] of Object.entries(items)) {
    await prisma.purchase.create({
      data: {
        userId,
        articleId,
        quantity: parseInt(quantity),
        paidAt: new Date(),
        orderId: session.id,
      },
    });
  }

  // Clear the user's cart
  await prisma.cart.deleteMany({
    where: {
      userId,
      productId: {
        in: Object.keys(items),
      },
    },
  });
}

async function handleCompanyPaymentSuccess(session) {
  const companyId = session.metadata.companyId;
  const purchasedById = session.metadata.purchasedById; // User who made the purchase
  const items = JSON.parse(session.metadata.items || "{}");

  if (!companyId || !purchasedById || !items || Object.keys(items).length === 0) {
    throw new Error("Invalid session metadata for company purchase");
  }

  // Record the company purchases in the database
  for (const [articleId, quantity] of Object.entries(items)) {
    await prisma.companyPurchase.create({
      data: {
        companyId,
        articleId,
        purchasedById,
        quantity: parseInt(quantity),
        paidAt: new Date(),
        orderId: session.id,
      },
    });
  }

  // Clear the related company cart items
  // We use the company_ prefix convention for company cart items
  const productPrefixes = Object.keys(items).map(id => `company_${companyId}_${id}`);
  
  await prisma.cart.deleteMany({
    where: {
      userId: purchasedById,
      productId: {
        in: productPrefixes,
      },
    },
  });
} 