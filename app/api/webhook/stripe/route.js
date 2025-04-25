import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/libs/prisma";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let data;
  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // or a one-time payment is completed (if mode was set to "payment")
        // ✅ Grant access to the product

        const session = await findCheckoutSession(data.object.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = data.object.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

        // Check if this is a cart purchase by looking for cart_items in metadata
        const cartItems = data.object.metadata?.cart_items ? 
          JSON.parse(data.object.metadata.cart_items) : null;

        if (cartItems) {
          // This is a cart purchase
          if (!userId) {
            console.error("No user ID found for cart purchase");
            throw new Error("No user ID found for cart purchase");
          }

          // Get the user
          const user = await prisma.user.findUnique({
            where: { id: userId }
          });

          if (!user) {
            console.error("User not found for cart purchase");
            throw new Error("User not found for cart purchase");
          }

          // Update user's customerId if not already set
          if (!user.customerId && customerId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId }
            });
          }

          // Create purchase records for each cart item
          await Promise.all(cartItems.map(async (item) => {
            await prisma.purchase.create({
              data: {
                userId: user.id,
                articleId: item.productId,
                quantity: item.quantity,
                paidAt: new Date(),
                orderId: data.object.id
              }
            });
          }));

          // Clear the user's cart after successful purchase
          await prisma.cart.deleteMany({
            where: { userId: user.id }
          });

          break;
        }

        // If not a cart purchase, continue with the existing logic for single article purchase
        if (!plan) break;

        const customer = await stripe.customers.retrieve(customerId);

        let user;

        // Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
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
              priceId: priceId,
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
                  orderId: data.object.id
                }
              });
            }
          }
        });

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail({to: ...});
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const subscription = await stripe.subscriptions.retrieve(
          data.object.id
        );
        const user = await prisma.user.findFirst({
          where: { customerId: subscription.customer }
        });

        if (user) {
          // Find the article associated with this plan
          const plan = configFile.stripe.plans.find(
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

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const priceId = data.object.lines.data[0].price.id;
        const customerId = data.object.customer;

        const user = await prisma.user.findFirst({
          where: { customerId }
        });

        if (user) {
          // Make sure the invoice is for the same plan (priceId) the user subscribed to
          if (user.priceId !== priceId) break;

          // Find the article associated with this plan
          const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
          
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
                  orderId: data.object.id
                }
              });
            }
          }
        }

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: " + e.message + " | EVENT TYPE: " + eventType);
  }

  return NextResponse.json({});
}
