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
      
      <main className="min-h-screen pt-24 pb-10 bg-white dark:bg-black">
        <div className="container px-6 md:px-10 mx-auto">
          {/* Chemin de navigation */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-base-content/60">
              <Link href="/" className="hover:text-primary transition-colors">
                Accueil
              </Link>
              <span className="mx-2">/</span>
              <Link href="/articles" className="hover:text-primary transition-colors">
                Boutique
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-base-content/80">{article.title}</span>
            </nav>
          </div>
          
          {/* Section détail article */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="aspect-square relative bg-base-100 rounded-3xl overflow-hidden shadow-md border border-base-300">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <span className="text-white text-6xl font-medium">{article.title.charAt(0)}</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
                  {article.category}
                </span>
              </div>
            </div>
            
            {/* Informations produit */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-base-content/70 text-sm">
                  4 étoiles sur 5 (12 avis)
                </span>
              </div>
              
              <p className="text-lg text-base-content/80 mb-8">
                {article.description}
              </p>
              
              <div className="border-t border-b border-base-300 py-6 mb-8">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Disponibilité</span>
                    <span className="text-green-500 font-medium">En stock</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Catégorie</span>
                    <span className="text-base-content font-medium">{article.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Livraison</span>
                    <span className="text-base-content font-medium">2-4 jours ouvrables</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-8">
                <span className="text-3xl font-bold text-primary">{article.price.toFixed(2)} €</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <AddToCartButton articleId={article.id} title={article.title} />
                <button className="btn border border-primary/20 hover:border-primary/40 bg-transparent hover:bg-primary/5 text-primary sm:flex-1">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Ajouter aux favoris
                </button>
              </div>
            </div>
          </div>
          
          {/* Articles recommandés */}
          {recommendedArticles.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8 text-base-content">
                Vous pourriez aussi aimer
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedArticles.map((recArticle) => (
                  <Link href={`/articles/${recArticle.id}`} key={recArticle.id}>
                    <div className="group h-full bg-base-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-base-300 flex flex-col">
                      <div className="relative w-full h-48 overflow-hidden">
                        {recArticle.image ? (
                          <Image
                            src={recArticle.image}
                            alt={recArticle.title}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                            <span className="text-white text-xl font-medium">{recArticle.title.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-lg font-medium mb-2 text-base-content group-hover:text-primary transition-colors">
                          {recArticle.title}
                        </h3>
                        <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
                          {recArticle.description}
                        </p>
                        <div className="mt-auto">
                          <span className="text-primary font-bold">{recArticle.price.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
} 