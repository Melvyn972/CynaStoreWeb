import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from "@/components/Header";
import Hero from "@/components/Hero";

// Composants en lazy loading pour réduire le bundle initial
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

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

export default function Home() {
  return (
    <>
      {/* Précharger le contenu critique above-the-fold */}
      <Suspense fallback={<div className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
        <Header />
      </Suspense>
      
      <main>
        {/* Hero section - critique pour le LCP, chargé immédiatement */}
        <Hero />
        
        {/* Composants moins critiques en lazy loading */}
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
      </main>
      
      <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
        <Footer />
      </Suspense>
    </>
  );
}