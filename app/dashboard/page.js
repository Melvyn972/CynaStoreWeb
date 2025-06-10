import ButtonAccount from "@/components/ButtonAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Image from "next/image";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const purchases = await prisma.purchase.findMany({
    where: {
      userId: user.id,
    },
    include: {
      article: true,
    },
  });

  // Group purchases by article
  const groupedPurchases = purchases.reduce((acc, purchase) => {
    const articleId = purchase.article?.id;
    
    if (!articleId) return acc;
    
    if (!acc[articleId]) {
      acc[articleId] = {
        article: purchase.article,
        totalQuantity: purchase.quantity,
        purchases: [purchase],
        latestPurchaseDate: purchase.purchaseDate
      };
    } else {
      acc[articleId].totalQuantity += purchase.quantity;
      acc[articleId].purchases.push(purchase);
      
      // Keep track of the most recent purchase date
      if (new Date(purchase.purchaseDate) > new Date(acc[articleId].latestPurchaseDate)) {
        acc[articleId].latestPurchaseDate = purchase.purchaseDate;
      }
    }
    
    return acc;
  }, {});

  const articlesArray = Object.values(groupedPurchases);
  
  // Calculate statistics
  const totalSpent = purchases.reduce((sum, purchase) => {
    return sum + (purchase.article?.price || 0) * purchase.quantity;
  }, 0);
  
  const totalItems = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);

  // Get company information
  const ownedCompanies = await prisma.company.findMany({
    where: { ownerId: user.id },
  });

  const memberCompanies = await prisma.companyMember.findMany({
    where: { userId: user.id },
    include: { company: true },
  });

  const totalCompanies = ownedCompanies.length + 
    memberCompanies.filter(m => !ownedCompanies.some(c => c.id === m.companyId)).length;

  // Get pending invitations
  const pendingInvitations = await prisma.companyInvitation.findMany({
    where: { 
      userId: user.id,
      status: "PENDING"
    }
  });

  return (
    <main className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-20 pt-24 pb-20">
        <div className="ios-container px-6 md:px-10 mx-auto">
        {/* Header moderne */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 ios-fade-in">
          <div>
            <h1 className="ios-title mb-4">
              Tableau de <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">bord</span>
            </h1>
            <p className="ios-body text-lg">
              Bienvenue, <span className="text-purple-600 dark:text-purple-400 font-semibold">{user.name || user.email.split('@')[0]}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <Link 
              href="/" 
              className="ios-button-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Accueil
            </Link>
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>
        
        {/* Statistiques rapides */}
        <div className="ios-grid-4 mb-12 ios-slide-up">
          <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="dashboard-stat-value">{totalItems}</div>
            <div className="dashboard-stat-label">Articles achetés</div>
          </div>
          
          <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="dashboard-stat-value">{totalSpent.toFixed(2)} €</div>
            <div className="dashboard-stat-label">Total dépensé</div>
          </div>
          
          <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="dashboard-stat-value">{totalCompanies}</div>
            <div className="dashboard-stat-label">Entreprises</div>
          </div>
          
          <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l6.172 6.172M15 7l-6.172 6.172" />
              </svg>
            </div>
            <div className="dashboard-stat-value">{pendingInvitations.length}</div>
            <div className="dashboard-stat-label">Invitations</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Profil utilisateur moderne */}
          <div className="lg:col-span-5 dashboard-card ios-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Utilisateur"}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/30"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-gray-950"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                  {user.name || "Utilisateur"}
                </h2>
                <p className="text-black/60 dark:text-white/60 mb-1">{user.email}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 ios-glass-light rounded-2xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-black/80 dark:text-white/80">Téléphone</span>
                </div>
                <span className="text-black dark:text-white">{user.phone || "Non défini"}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 ios-glass-light rounded-2xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7l-2 9a1 1 0 001 1h8a1 1 0 001-1L14 7M8 7h6m0 0V3" />
                  </svg>
                  <span className="text-black/80 dark:text-white/80">Membre depuis</span>
                </div>
                <span className="text-black dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            </div>
            
            <Link 
              href="/dashboard/profile" 
              className="w-full ios-button-primary justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Modifier mon profil
            </Link>
          </div>

          {/* Actions rapides */}
          <div className="lg:col-span-7 space-y-6 ios-slide-up" style={{animationDelay: '0.2s'}}>
            {/* Entreprises */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Mes entreprises
                </h3>
                {pendingInvitations.length > 0 && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full border border-orange-500/30">
                    {pendingInvitations.length} en attente
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 ios-glass-light rounded-2xl">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{ownedCompanies.length}</div>
                  <div className="text-sm text-black/60 dark:text-white/60">Créées</div>
                </div>
                <div className="text-center p-4 ios-glass-light rounded-2xl">
                  <div className="text-2xl font-bold text-indigo-400 mb-1">{memberCompanies.length}</div>
                  <div className="text-sm text-black/60 dark:text-white/60">Membre</div>
                </div>
              </div>
              
              <Link 
                href="/dashboard/companies" 
                className="w-full ios-button-secondary justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Gérer mes entreprises
              </Link>
            </div>

            {/* Boutique et commandes */}
            <div className="dashboard-card">
              <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                Mes achats
              </h3>
              
              <div className="space-y-3">
                <Link 
                  href="/dashboard/orders" 
                  className="w-full ios-button-primary justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Mes commandes
                </Link>
                
                <Link 
                  href="/articles" 
                  className="w-full ios-button-secondary justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir la boutique
                </Link>
                
                <Link 
                  href="/cart" 
                  className="w-full ios-button-secondary justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8l2 6h12M7 13v6M17 13v6" />
                  </svg>
                  Voir le panier
                </Link>
              </div>
            </div>

            {/* Conformité RGPD */}
            <div className="dashboard-card">
              <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                Confidentialité & RGPD
              </h3>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-4 ios-glass-light rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                      <span className="text-sm text-black/80 dark:text-white/80">Marketing</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.consentMarketing 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {user.consentMarketing ? 'Accepté' : 'Refusé'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 ios-glass-light rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-sm text-black/80 dark:text-white/80">Analyses</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.consentAnalytics 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {user.consentAnalytics ? 'Accepté' : 'Refusé'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link 
                  href="/dashboard/rgpd" 
                  className="w-full ios-button-primary justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Gérer mes consentements
                </Link>
                
                <Link 
                  href="/dashboard/data-export" 
                  className="w-full ios-button-secondary justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter mes données
                </Link>
              </div>
            </div>

            {/* Admin Panel */}
            {user.role === "ADMIN" && (
              <div className="dashboard-card">
                <h3 className="text-xl font-semibold text-black dark:text-white flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                    </svg>
                  </div>
                  Administration
                </h3>
                <p className="ios-body mb-6">
                                     Accédez au panneau d&apos;administration pour gérer les utilisateurs et les paramètres.
                </p>
                <Link 
                  href="/dashboard/admin" 
                  className="w-full ios-button-primary justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                  </svg>
                                     Panneau d&apos;administration
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Achats récents */}
        {articlesArray.length > 0 && (
          <div className="mt-12 ios-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Mes achats récents
            </h2>
            
            <div className="ios-grid-3">
              {articlesArray.slice(0, 6).map((item) => (
                <Link 
                  href={`/articles/${item.article.id}`} 
                  key={item.article.id}
                                     className="product-card group ios-fade-in"
                >
                  <div className="product-image">
                    {item.article.image ? (
                      <Image
                        src={item.article.image}
                        alt={item.article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {item.article.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 ios-glass-light text-white text-xs rounded-full">
                        {item.totalQuantity}x
                      </span>
                    </div>
                  </div>
                  
                  <div className="product-content">
                    <h3 className="product-title text-lg">
                      {item.article.title}
                    </h3>
                    <p className="ios-body text-sm mb-4">
                      Acheté le {new Date(item.latestPurchaseDate).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="product-price">
                      {(item.article.price * item.totalQuantity).toFixed(2)} €
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
