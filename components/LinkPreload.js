"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LinkPreload({ href, children, className, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Précharger la route
    router.prefetch(href);
    
    // Petit délai pour montrer l'indicateur de chargement
    setTimeout(() => {
      router.push(href);
      setIsLoading(false);
    }, 100);
  };

  return (
    <Link 
      href={href} 
      className={`${className} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Chargement...</span>
        </div>
      ) : (
        children
      )}
    </Link>
  );
}
