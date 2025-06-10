import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import prisma from '@/libs/prisma';

export async function GET() {
  try {
    // Vérification de la session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' }, 
        { status: 401 }
      );
    }

    // Récupération de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' }, 
        { status: 404 }
      );
    }

    // Récupération des purchases de l'utilisateur avec relations
    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true
          }
        }
      },
      orderBy: { purchaseDate: 'desc' }
    });

    // Regroupement des purchases par date de commande
    const ordersMap = new Map();

    purchases.forEach(purchase => {
      const purchaseDate = purchase.purchaseDate || new Date();
      const dateKey = purchaseDate.toDateString();
      
      if (!ordersMap.has(dateKey)) {
        ordersMap.set(dateKey, {
          date: purchaseDate,
          items: [],
          total: 0,
          totalQuantity: 0
        });
      }
      
      const order = ordersMap.get(dateKey);
      const quantity = purchase.quantity || 1;
      const articlePrice = purchase.article?.price || 0;
      
      // Chercher si l'article existe déjà dans cette commande
      const existingItem = order.items.find(item => item.article.id === purchase.article.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        order.items.push({
          article: purchase.article,
          quantity: quantity
        });
      }
      
      order.total += articlePrice * quantity;
      order.totalQuantity += quantity;
    });

    // Conversion en tableau et tri par date décroissante
    const orders = Array.from(ordersMap.values())
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calcul des statistiques
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
      totalItems: orders.reduce((sum, order) => sum + order.totalQuantity, 0)
    };

    return NextResponse.json({
      orders,
      stats,
      success: true
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
} 