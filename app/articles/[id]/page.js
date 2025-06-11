import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import prisma from "@/libs/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import BackgroundEffects from "@/app/components/BackgroundEffects";

// Génération des métadonnées dynamiques pour chaque article
export async function generateMetadata({ params }) {
  const article = await prisma.articles.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    return getSEOTags({
      title: `Article non trouvé | ${config.appName}`,
      canonicalUrlRelative: `/articles/${params.id}`,
      description: "L'article que vous recherchez n'existe pas.",
    });
  }

  return getSEOTags({
    title: `${article.title} | ${config.appName}`,
    canonicalUrlRelative: `/articles/${params.id}`,
    description: article.description,
    openGraph: {
      images: [{ url: article.image || "/opengraph-image.png" }],
    },
  });
}

export default async function ArticleDetail({ params }) {
  const article = await prisma.articles.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    notFound();
  }

  // Simuler des articles recommandés (à remplacer par une vraie logique)
  const recommendedArticles = await prisma.articles.findMany({
    where: {
      id: { not: params.id },
      category: article.category,
    },
    take: 3,
  });

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      
      <main className="min-h-screen relative overflow-hidden pt-24 pb-20">
        <BackgroundEffects />
        <div className="ios-container space-y-8 relative z-20">
          {/* Breadcrumb moderne */}
          <div className="ios-fade-in">
            <nav className="flex items-center gap-2 text-sm mb-4">
              <Link href="/" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                Accueil
              </Link>
              <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/articles" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                Boutique
              </Link>
              <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-black dark:text-white font-medium">{article.title}</span>
            </nav>
          </div>
          
          {/* Section principale */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ios-slide-up">
            {/* Galerie d'images */}
            <div className="dashboard-card">
              <div className="aspect-square relative rounded-2xl overflow-hidden">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-8xl font-bold">{article.title.charAt(0)}</span>
                  </div>
                )}
                
                {/* Badge catégorie */}
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 ios-glass-light text-white text-sm font-medium rounded-full backdrop-blur-md border border-white/20">
                    {article.category}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Informations du produit */}
            <div className="dashboard-card">
              <div className="space-y-6">
                {/* Titre et évaluation */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
                    {article.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-600"}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-black/60 dark:text-white/60 text-sm">
                      4.9/5 · 12 avis
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="ios-glass-light rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Description
                  </h3>
                  <p className="ios-body">
                    {article.description}
                  </p>
                </div>
                
                {/* Spécifications */}
                <div className="ios-glass-light rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Spécifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/70">Disponibilité</span>
                      <span className="flex items-center gap-2 text-emerald-400 font-medium">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        En stock
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/70">Catégorie</span>
                      <span className="text-white font-medium">{article.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/70">Livraison</span>
                      <span className="text-white font-medium">2-4 jours ouvrables</span>
                    </div>
                  </div>
                </div>
                
                {/* Prix et actions */}
                <div className="ios-glass-light rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Prix</p>
                      <span className="text-4xl font-bold text-white">{article.price.toFixed(2)} €</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm mb-1">Économies</p>
                      <span className="text-emerald-400 font-semibold">Livraison gratuite</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <AddToCartButton articleId={article.id} title={article.title} />
                    <button className="w-full ios-button-secondary justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Ajouter aux favoris
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Articles recommandés */}
          {recommendedArticles.length > 0 && (
            <div className="ios-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Vous pourriez aussi aimer</h2>
                    <p className="ios-body text-sm">Découvrez des produits similaires</p>
                  </div>
                </div>
                
                <div className="ios-grid-3">
                  {recommendedArticles.map((recArticle) => (
                    <Link href={`/articles/${recArticle.id}`} key={recArticle.id} className="product-card group">
                      <div className="product-image">
                        {recArticle.image ? (
                          <Image
                            src={recArticle.image}
                            alt={recArticle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">{recArticle.title.charAt(0)}</span>
                          </div>
                        )}
                        
                        {/* Badge catégorie */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 ios-glass-light text-white text-xs font-medium rounded-full backdrop-blur-md">
                            {recArticle.category}
                          </span>
                        </div>
                        
                        {/* Overlay au hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Action button au hover */}
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="w-full ios-button-primary justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Voir les détails
                          </button>
                        </div>
                      </div>
                      
                      <div className="product-content">
                        <h3 className="product-title">
                          {recArticle.title}
                        </h3>
                        <p className="ios-body text-sm line-clamp-2 mb-4">
                          {recArticle.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="product-price">
                            {recArticle.price.toFixed(2)} €
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-white/60">4.9</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Retour à la boutique */}
          <div className="text-center ios-fade-in" style={{animationDelay: '0.3s'}}>
            <Link href="/articles" className="ios-button-secondary inline-flex">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la boutique
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 