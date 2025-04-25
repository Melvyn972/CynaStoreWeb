"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CartCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cart');
        
        if (response.status === 401) {
          // User not logged in
          setCount(0);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const cartItems = await response.json();
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCount(itemCount);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartCount();
  }, [pathname]); // Refetch when pathname changes

  return (
    <Link href="/cart" className="relative flex items-center gap-1">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-base-content dark:text-white" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      {!isLoading && (
        <span className="text-sm font-medium">
          {count > 0 ? count : ''}
        </span>
      )}
    </Link>
  );
} 