"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from "@/components/Header";

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>,
  ssr: false
});

const PageLayout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Suspense fallback={<div className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
          <Header />
        </Suspense>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && (
        <Suspense fallback={<div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
};

export default PageLayout;
