import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/libs/auth-middleware";
import prisma from "@/libs/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { lineItems, companyId, successUrl, cancelUrl } = await request.json();
    
    if (!companyId || !lineItems || !lineItems.length || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if the user is a member of the company
    const isMember = await prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });
    
    if (!isMember) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à effectuer des achats pour cette entreprise" },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Get company information
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Format line items for Stripe
    const stripeLineItems = [];
    let metadataItems = {};
    
    for (const item of lineItems) {
      const article = await prisma.articles.findUnique({
        where: { id: item.productId },
      });
      
      if (!article) {
        continue;
      }
      
      stripeLineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: article.title,
            description: article.description,
            images: article.image ? [article.image] : [],
          },
          unit_amount: Math.round(article.price * 100), // Stripe needs amount in cents
        },
        quantity: item.quantity,
      });
      
      metadataItems[article.id] = item.quantity.toString();
    }
    
    if (stripeLineItems.length === 0) {
      return NextResponse.json(
        { error: "Aucun article valide dans le panier" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      success_url: successUrl + `?session_id={CHECKOUT_SESSION_ID}&company=${companyId}`,
      cancel_url: cancelUrl,
      customer_email: company.email || user.email, // Use company email if available
      metadata: {
        userId: user.id,
        companyId: company.id,
        companyName: company.name,
        purchasedById: user.id,
        items: JSON.stringify(metadataItems),
      },
    });
    
    return NextResponse.json({ url: stripeSession.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating company checkout session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500, headers: corsHeaders }
    );
  }
} 