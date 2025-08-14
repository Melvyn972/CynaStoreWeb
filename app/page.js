import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageLayout from "@/components/PageLayout";
import DynamicCarousel from "@/components/DynamicCarousel";
import DynamicContent from "@/components/DynamicContent";
import DynamicCategories from "@/components/DynamicCategories";

const Problem = dynamic(() => import("@/components/Problem"), {
  loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const FeaturesAccordion = dynamic(() => import("@/components/FeaturesAccordion"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const CTA = dynamic(() => import("@/components/CTA"), {
  loading: () => <div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

export default function Home() {
  return (
    <PageLayout>
      <DynamicCarousel />
      
      <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
        <DynamicCategories />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
        <DynamicContent pageLocation="homepage" />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
        <Problem />
      </Suspense>
      
      <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
        <FeaturesAccordion />
      </Suspense>
      
      <Suspense fallback={<div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
        <CTA />
      </Suspense>
    </PageLayout>
  );
}