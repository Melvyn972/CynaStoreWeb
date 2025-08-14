import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les statistiques en parallèle pour de meilleures performances
    const [purchases, ownedCompanies, memberCompanies, pendingInvitations] = await Promise.all([
      // Achats
      prisma.purchase.findMany({
        where: { userId: user.id },
        select: {
          quantity: true,
          article: {
            select: { price: true }
          }
        }
      }),
      
      // Entreprises possédées
      prisma.company.count({
        where: { ownerId: user.id }
      }),
      
      // Entreprises où l'utilisateur est membre
      prisma.companyMember.findMany({
        where: { userId: user.id },
        select: {
          company: {
            select: { id: true, ownerId: true }
          }
        }
      }),
      
      // Invitations en attente
      prisma.companyInvitation.count({
        where: { 
          userId: user.id,
          status: "PENDING"
        }
      })
    ]);

    // Calculer les statistiques
    const totalItems = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
    const totalSpent = purchases.reduce((sum, purchase) => {
      return sum + (purchase.article?.price || 0) * purchase.quantity;
    }, 0);

    // Calculer le nombre total d'entreprises (sans doublons)
    const memberCompanyIds = memberCompanies.map(m => m.company.id);
    const uniqueMemberCompanies = memberCompanies.filter(m => m.company.ownerId !== user.id);
    const totalCompanies = ownedCompanies + uniqueMemberCompanies.length;

    const stats = {
      totalItems,
      totalSpent,
      totalCompanies,
      pendingInvitations,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error) {
    console.error("Erreur API dashboard stats:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
