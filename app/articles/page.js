import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import prisma from "@/libs/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import ArticlesClient from "./ArticlesClient";

export const metadata = getSEOTags({
  title: `Boutique | ${config.appName}`,
  canonicalUrlRelative: "/articles",
});

const ArticlesPage = async () => {
  const articles = await prisma.articles.findMany();
  
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      
      <ArticlesClient articles={articles} />
      
      <Footer />
    </>
  );
};

export default ArticlesPage;

