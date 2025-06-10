import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "Accès refusé - Privilèges administrateur requis" },
        { status: 403 }
      );
    }

    // Récupérer toutes les commandes avec les détails
    const orders = await prisma.purchase.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });

    // Transformer les données pour regrouper par commande
    const groupedOrders = {};
    
    orders.forEach(purchase => {
      const orderDate = purchase.purchaseDate || new Date();
      const orderId = `${purchase.userId}-${orderDate.toISOString().split('T')[0]}`;
      
      if (!groupedOrders[orderId]) {
        groupedOrders[orderId] = {
          id: orderId,
          userId: purchase.userId,
          user: purchase.user,
          createdAt: orderDate,
          items: []
        };
      }
      
      groupedOrders[orderId].items.push({
        articleId: purchase.articleId,
        articleTitle: purchase.article?.title || 'Article supprimé',
        price: purchase.article?.price || 0,
        quantity: purchase.quantity || 1,
        image: purchase.article?.image
      });
    });

    // Consolider les articles identiques dans chaque commande
    Object.values(groupedOrders).forEach(order => {
      const consolidatedItems = {};
      
      order.items.forEach(item => {
        if (consolidatedItems[item.articleId]) {
          consolidatedItems[item.articleId].quantity += item.quantity;
        } else {
          consolidatedItems[item.articleId] = { ...item };
        }
      });
      
      order.items = Object.values(consolidatedItems);
    });

    const formattedOrders = Object.values(groupedOrders);

    return NextResponse.json(formattedOrders);

  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 