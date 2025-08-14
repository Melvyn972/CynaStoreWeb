import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import prisma from "@/libs/prisma";
import PageLayout from "@/components/PageLayout";
import { Suspense } from "react";
import ArticlesClient from "./ArticlesClient";

export const metadata = getSEOTags({
  title: `Boutique | ${config.appName}`,
  canonicalUrlRelative: "/articles",
});

const ArticlesPage = async () => {
  const articles = await prisma.articles.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      image: true,
      images: true,
      stock: true,
      subscriptionDuration: true,
      createdAt: true,
      categoryObj: {
        select: {
          id: true,
          name: true
        }
      },
      specifications: {
        select: {
          technicalSpecification: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limiter le nombre d'articles pour les performances
  });
  
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="min-h-screen relative overflow-hidden">
          <div className="ios-container pt-24 pb-20 relative z-20">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      }>
        <ArticlesClient articles={articles} />
      </Suspense>
    </PageLayout>
  );
};

export default ArticlesPage;

