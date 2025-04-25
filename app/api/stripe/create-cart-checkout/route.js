import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import Stripe from "stripe";
import prisma from "@/libs/prisma";

export async function POST(req) {
  const body = await req.json();
  
  if (!body.lineItems || !body.lineItems.length) {
    return NextResponse.json(
      { error: "Line items are required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to create a checkout session" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Fetch products from the database to validate and get accurate prices
    const productIds = body.lineItems.map(item => item.productId);
    const products = await prisma.articles.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });
    
    // Create a product lookup map
    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
    
    // Create Stripe line items with the correct price
    const stripeLineItems = body.lineItems.map(item => {
      const product = productMap[item.productId];
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Validate image URL - ensure it's an absolute URL
      const imageUrls = [];
      if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
        imageUrls.push(product.image);
      }
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.title,
            description: product.description,
            images: imageUrls,
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Customer data for Stripe
    const customerData = {};
    
    if (user.customerId) {
      customerData.customer = user.customerId;
    } else {
      customerData.customer_creation = "always";
      customerData.customer_email = user.email;
    }
    
    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items: stripeLineItems,
      metadata: {
        cart_items: JSON.stringify(body.lineItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })))
      },
      success_url: `${body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
      client_reference_id: user.id,
      ...customerData
    });
    
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 