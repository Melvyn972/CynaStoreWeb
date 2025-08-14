import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import Image from "next/image";
import BackgroundEffects from 
"@/app/components/BackgroundEffects";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  
  // Get all categories
  const categories = await prisma.category.findMany({
    orderBy: {
      displayOrder: 'asc'
    },
    include: {
      _count: {
        select: { articles: true }
      }
    }
  });

  const totalCategories = categories.length;
  const activeCategories = categories.filter(cat => cat.isActive).length;

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl">
              Gestion des Catégories
            </h1>
            <p className="ios-body text-lg mt-2">
              Gérez les catégories de produits et leur organisation
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
              href="/dashboard/admin/categories/new"
              className="ios-button-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle catégorie
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="ios-grid-3 ios-slide-up mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {totalCategories}
                </div>
                <div className="ios-body">Catégories totales</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {activeCategories}
                </div>
                <div className="ios-body">Catégories actives</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {categories.reduce((sum, cat) => sum + cat._count.articles, 0)}
                </div>
                <div className="ios-body">Articles associés</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des catégories */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              Toutes les catégories ({totalCategories})
            </h2>
            <Link href="/dashboard/admin/categories/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle catégorie
            </Link>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="ios-body">Aucune catégorie trouvée</p>
              <Link
                href="/dashboard/admin/categories/new"
                className="ios-button-primary mt-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer la première catégorie
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="ios-glass-light rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    {/* Image de la catégorie */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Informations de la catégorie */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {category.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          category.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                          Ordre: {category.displayOrder}
                        </div>
                      </div>
                      <p className="ios-body text-sm text-white/70 mb-2">
                        {category.description || "Aucune description"}
                      </p>
                      <div className="text-xs text-white/50">
                        {category._count.articles} article(s) associé(s)
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/dashboard/admin/categories/edit/${category.id}`}
                        className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <Link 
                        href={`/dashboard/admin/categories/delete/${category.id}`}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
