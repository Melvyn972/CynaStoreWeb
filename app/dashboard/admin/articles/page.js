import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import Image from "next/image";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const session = await getServerSession(authOptions);
  
  // Obtenir tous les articles
  const articles = await prisma.articles.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const totalArticles = articles.length;
  const totalValue = articles.reduce((sum, article) => sum + (article.price || 0), 0);
  const averagePrice = totalArticles > 0 ? totalValue / totalArticles : 0;

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl">
              Gestion des Articles
            </h1>
            <p className="ios-body text-lg mt-2">
              Gérez tous les articles et produits de la boutique
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour Admin
            </Link>
            <Link
              href="/dashboard/admin/articles/new"
              className="ios-button-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvel article
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="ios-grid-3 ios-slide-up mb-8">
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{totalArticles}</div>
            <div className="dashboard-stat-label">Total Articles</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{totalValue.toFixed(0)}€</div>
            <div className="dashboard-stat-label">Valeur Totale</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{averagePrice.toFixed(0)}€</div>
            <div className="dashboard-stat-label">Prix Moyen</div>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              Tous les articles ({totalArticles})
            </h2>
            <Link href="/dashboard/admin/articles/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvel article
            </Link>
          </div>
          
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="ios-body">Aucun article trouvé</p>
              <Link
                href="/dashboard/admin/articles/new"
                className="ios-button-primary mt-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer le premier article
              </Link>
            </div>
          ) : (
            <div className="ios-grid-3">
              {articles.map((article) => (
                <div key={article.id} className="product-card group">
                  <div className="product-image relative">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {article.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge d'administration */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <Link 
                          href={`/dashboard/admin/articles/edit/${article.id}`}
                          className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <Link 
                          href={`/dashboard/admin/articles/delete/${article.id}`}
                          className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="product-content">
                    <h3 className="product-title text-lg line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="ios-body text-sm mb-4 line-clamp-3">
                      {article.description || "Aucune description"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="product-price">
                        {article.price?.toFixed(2)} €
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        article.stock > 0 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        Stock: {article.stock || 0}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/admin/articles/edit/${article.id}`}
                        className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/30 transition-colors"
                      >
                        Éditer
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 