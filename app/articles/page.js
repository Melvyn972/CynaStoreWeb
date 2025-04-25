import Link from "next/link";
import Image from "next/image";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import prisma from "@/libs/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export const metadata = getSEOTags({
  title: `Articles | ${config.appName}`,
  canonicalUrlRelative: "/articles",
});

const Articles = async () => {
  const articles = await prisma.articles.findMany();
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <div className="min-h-screen pt-24 pb-10 bg-white dark:bg-black">
        <div className="container px-6 md:px-10 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Notre Boutique
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id}>
                <div className="group h-full bg-base-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-base-300 flex flex-col">
                  <div className="relative w-full h-48 overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                        <span className="text-white text-xl font-medium">{article.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-base-content group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-base-300 flex justify-between items-center">
                      <span className="text-primary font-medium text-sm">
                        Voir les détails
                      </span>
                      <span className="text-primary font-bold">
                        {article.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {articles.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-base-content/70">
                Aucun article disponible pour le moment
              </h3>
              <p className="mt-2 text-base-content/50">
                Revenez bientôt pour découvrir nos produits
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Articles;

