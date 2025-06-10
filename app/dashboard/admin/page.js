import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // Obtenir le nombre d'utilisateurs par rôle
  const userStats = await prisma.$queryRaw`
    SELECT role, COUNT(*) as count 
    FROM User 
    GROUP BY role
  `;
  
  // Obtenir les statistiques de base du système
  const totalUsers = await prisma.user.count();
  const totalArticles = await prisma.articles.count();
  
  // Obtenir tous les articles
  const articles = await prisma.articles.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  // Obtenir tous les utilisateurs avec leurs achats
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      _count: {
        select: { purchases: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="ios-container space-y-8">
        {/* Header Admin avec bouton retour */}
        <div className="flex items-center justify-between ios-fade-in mb-12">
          <div className="text-center flex-1">
            <h1 className="ios-title text-4xl md:text-5xl mb-4">
              Administration
            </h1>
            <p className="ios-body text-lg max-w-2xl mx-auto">
              Bienvenue, {session.user.name || session.user.email}. 
              Gérez votre plateforme depuis ce tableau de bord centralisé.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="ios-button-secondary absolute top-6 left-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>

        {/* Statistiques principales */}
        <div className="ios-grid-4 ios-slide-up mb-12">
          {/* Total Utilisateurs */}
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{totalUsers}</div>
            <div className="dashboard-stat-label mb-4">Total Utilisateurs</div>
            <Link href="/dashboard/admin/users" className="ios-button-secondary w-full">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Voir tous
            </Link>
          </div>

          {/* Total Articles */}
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{totalArticles}</div>
            <div className="dashboard-stat-label mb-4">Total Articles</div>
            <Link href="/dashboard/admin/articles" className="ios-button-secondary w-full">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Voir tous
            </Link>
          </div>

          {/* Statistiques par rôle */}
          {userStats.map((stat) => (
            <div key={stat.role} className="dashboard-card text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                stat.role === 'ADMIN' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="dashboard-stat-value text-4xl mb-2">{stat.count}</div>
              <div className="dashboard-stat-label mb-4">
                {stat.role === 'ADMIN' ? 'Administrateurs' : 'Membres'}
              </div>
              <Link 
                href={`/dashboard/admin/users?role=${stat.role}`} 
                className="ios-button-secondary w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Voir les {stat.role === 'ADMIN' ? 'admins' : 'membres'}
              </Link>
            </div>
          ))}
        </div>

        {/* Actions rapides - SEULEMENT 2 cartes */}
        <div className="ios-grid-2 ios-slide-up mb-12" style={{animationDelay: '0.1s'}}>
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              Gestion des utilisateurs
            </h3>
            <p className="ios-body mb-6">
              Ajoutez, modifiez ou supprimez des utilisateurs de la plateforme.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/admin/users" className="ios-button-secondary w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Tous les utilisateurs
              </Link>
              <Link href="/dashboard/admin/users/new" className="ios-button-primary w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvel utilisateur
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              Gestion des articles
            </h3>
            <p className="ios-body mb-6">
              Gérez le catalogue de produits et les articles disponibles.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/admin/articles" className="ios-button-secondary w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Tous les articles
              </Link>
              <Link href="/dashboard/admin/articles/new" className="ios-button-primary w-full">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvel article
              </Link>
            </div>
          </div>
        </div>

        {/* Utilisateurs récents */}
        <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              Utilisateurs récents
            </h2>
            <Link href="/dashboard/admin/users/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvel utilisateur
            </Link>
          </div>
          
          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="ios-body">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="ios-glass-light rounded-2xl p-6 hover:bg-white/20 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        {user.image ? (
                          <Image 
                            src={user.image}
                            alt={user.name || user.email}
                            className="w-full h-full object-cover"
                            fill
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {(user.name || user.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-white font-semibold">
                          {user.name || user.email}
                        </h3>
                        <p className="text-white/60 text-sm">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span>Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                          <span>{user._count.purchases} achats</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.role === 'ADMIN' ? 'Admin' : 'Membre'}
                      </span>
                      
                      <Link 
                        href={`/dashboard/admin/users/edit/${user.id}`}
                        className="ios-button-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-6">
                <Link href="/dashboard/admin/users" className="ios-button-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir tous les utilisateurs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Articles récents */}
        {articles.length > 0 && (
          <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              Articles récents
            </h2>
            
            <div className="ios-grid-3">
              {articles.map((article) => (
                <Link 
                  href={`/dashboard/admin/articles/edit/${article.id}`} 
                  key={article.id}
                  className="product-card group"
                >
                  <div className="product-image">
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
                  </div>
                  
                  <div className="product-content">
                    <h3 className="product-title text-lg">
                      {article.title}
                    </h3>
                    <p className="ios-body text-sm mb-4 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="product-price">
                      {article.price?.toFixed(2)} €
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="text-center">
                <Link href="/dashboard/admin/articles" className="ios-button-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir tous les articles
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 