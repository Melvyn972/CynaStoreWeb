import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prisma";
import { headers } from "next/headers";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";

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

  const data = event.data;
  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const session = await findCheckoutSession(data.object.id);
        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = data.object.client_reference_id;
        const plan = configFile.stripe?.plans?.find((p) => p.priceId === priceId);

        // Check if this is a company purchase
        if (data.object.metadata?.companyId) {
          await handleCompanyPaymentSuccess(data.object);
        } else {
          // Handle cart items from metadata (new format)
          const cartItems = data.object.metadata?.cart_items ? 
            JSON.parse(data.object.metadata.cart_items) : null;

          if (cartItems) {
            await handleCartPaymentSuccess(data.object, cartItems, userId, customerId);
          } else if (plan) {
            // Handle plan/subscription purchase (legacy format)
            await handlePlanPaymentSuccess(data.object, plan, userId, customerId);
          } else {
            // Handle individual items (legacy format)
            await handlePaymentSuccess(data.object);
          }
        }
        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan
        break;
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancellation
        await handleSubscriptionDeleted(data.object);
        break;
      }

      case "invoice.paid": {
        // Handle recurring payment
        await handleInvoicePaid(data.object);
        break;
      }

      case "invoice.payment_failed": {
        // Handle payment failure
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook (${eventType}): ${error.message}`);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Handle cart payment success (new format with cart_items metadata)
async function handleCartPaymentSuccess(session, cartItems, userId, customerId) {
  if (!userId) {
    console.error("No user ID found for cart purchase");
    throw new Error("No user ID found for cart purchase");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    console.error("User not found for cart purchase");
    throw new Error("User not found for cart purchase");
  }

  // Update customer ID if needed
  if (!user.customerId && customerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { customerId }
    });
  }

  // Create purchases for each cart item
  await Promise.all(cartItems.map(async (item) => {
    await prisma.purchase.create({
      data: {
        userId: user.id,
        articleId: item.productId,
        quantity: item.quantity,
        paidAt: new Date(),
        orderId: session.id
      }
    });
  }));

  // Clear the user's cart
  await prisma.cart.deleteMany({
    where: { userId: user.id }
  });
}

// Handle plan/subscription payment success (legacy format)
async function handlePlanPaymentSuccess(session, plan, userId, customerId) {
  const customer = await stripe.customers.retrieve(customerId);
  let user;

  // Get or create the user
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId }
    });
  } else if (customer.email) {
    user = await prisma.user.findUnique({
      where: { email: customer.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: customer.email,
          name: customer.name,
        }
      });
    }
  } else {
    console.error("No user found");
    throw new Error("No user found");
  }

  // Update user data + Grant user access to purchased article or plan
  await prisma.$transaction(async (tx) => {
    // Update basic user data
    await tx.user.update({
      where: { id: user.id },
      data: {
        priceId: plan.priceId,
        customerId: customerId,
      }
    });
    
    // If plan contains an articleId, add it as a purchase
    if (plan.articleId) {
      // Check if the purchase already exists
      const existingPurchase = await tx.purchase.findUnique({
        where: {
          userId_articleId: {
            userId: user.id,
            articleId: plan.articleId
          }
        }
      });
      
      // Only create the purchase if it doesn't exist
      if (!existingPurchase) {
        await tx.purchase.create({
          data: {
            userId: user.id,
            articleId: plan.articleId,
            paidAt: new Date(),
            orderId: session.id
          }
        });
      }
    }
  });
}

// Handle individual payment success (legacy format)
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

// Handle company payment success
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

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  const user = await prisma.user.findFirst({
    where: { customerId: subscription.customer }
  });

  if (user) {
    // Find the article associated with this plan
    const plan = configFile.stripe?.plans?.find(
      (p) => p.priceId === user.priceId
    );
    
    if (plan && plan.articleId) {
      // Remove the purchase
      await prisma.purchase.deleteMany({
        where: {
          userId: user.id,
          articleId: plan.articleId
        }
      });
    }
  }
}

// Handle invoice payment
async function handleInvoicePaid(invoice) {
  const priceId = invoice.lines.data[0].price.id;
  const customerId = invoice.customer;

  const user = await prisma.user.findFirst({
    where: { customerId }
  });

  if (user) {
    // Make sure the invoice is for the same plan (priceId) the user subscribed to
    if (user.priceId !== priceId) return;

    // Find the article associated with this plan
    const plan = configFile.stripe?.plans?.find((p) => p.priceId === priceId);
    
    if (plan && plan.articleId) {
      // Check if the purchase already exists
      const existingPurchase = await prisma.purchase.findUnique({
        where: {
          userId_articleId: {
            userId: user.id,
            articleId: plan.articleId
          }
        }
      });
      
      // Only create the purchase if it doesn't exist
      if (!existingPurchase) {
        await prisma.purchase.create({
          data: {
            userId: user.id,
            articleId: plan.articleId,
            paidAt: new Date(),
            orderId: invoice.id
          }
        });
      }
    }
  }
} 