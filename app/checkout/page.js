"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import apiClient from "@/libs/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/cart');
        
        if (response.status === 401) {
          // User not logged in, redirect to login
          toast.error("Veuillez vous connecter pour finaliser votre commande");
          router.push('/auth/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const cartItems = await response.json();
        setCart(cartItems);
        
        // Get unique product IDs
        const productIds = [...new Set(cartItems.map(item => item.productId))];
        
        // Fetch product details
        if (productIds.length > 0) {
          const articlesRes = await fetch(`/api/articles?ids=${productIds.join(',')}`);
          if (!articlesRes.ok) {
            throw new Error('Failed to fetch product details');
          }
          const articlesData = await articlesRes.json();
          
          // Convert to lookup object
          const articlesLookup = {};
          articlesData.forEach(article => {
            articlesLookup[article.id] = article;
          });
          
          setArticles(articlesLookup);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error("Erreur lors du chargement du panier");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const article = articles[item.productId];
      if (article) {
        return total + (article.price * item.quantity);
      }
      return total;
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Create line items for Stripe checkout
      const lineItems = cart.map(item => {
        const article = articles[item.productId];
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: article.price
        };
      });

      // Create Stripe checkout session
      const response = await apiClient.post("/stripe/create-cart-checkout", {
        lineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cart`,
      });

      if (response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error("Erreur lors de la création de la session de paiement");
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Erreur lors de la création de la session de paiement");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <Header />
        <h1 className="text-3xl font-bold mt-16 mb-8">Finalisation de la commande</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <Header />
        <h1 className="text-3xl font-bold mt-16 mb-8">Finalisation de la commande</h1>
        <div className="flex flex-col items-center justify-center py-12 bg-base-200 dark:bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/50 dark:text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-base-content/70 dark:text-gray-300 text-xl mb-6">Votre panier est vide</p>
          <Link 
            href="/articles" 
            className="btn btn-primary"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <Header />
      <h1 className="text-3xl font-bold mt-16 mb-8">Finalisation de la commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-base-100 dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif de votre commande</h2>
            
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="bg-base-200 dark:bg-gray-700">Article</th>
                    <th className="bg-base-200 dark:bg-gray-700 text-right">Prix</th>
                    <th className="bg-base-200 dark:bg-gray-700 text-center">Quantité</th>
                    <th className="bg-base-200 dark:bg-gray-700 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => {
                    const article = articles[item.productId];
                    
                    if (!article) {
                      return null; // Skip if article not found
                    }
                    
                    return (
                      <tr key={item.id} className="hover">
                        <td className="font-medium">{article.title}</td>
                        <td className="text-right">{article.price.toFixed(2)} €</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right font-medium">{(article.price * item.quantity).toFixed(2)} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-base-100 dark:bg-gray-800 p-6 rounded-lg shadow sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-base-content/70 dark:text-gray-400">Sous-total</span>
                <span>{calculateTotal()} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70 dark:text-gray-400">Livraison</span>
                <span>0.00 €</span>
              </div>
              <div className="border-t border-base-300 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{calculateTotal()} €</span>
                </div>
              </div>
            </div>
            
            <button 
              className="btn btn-primary w-full" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : null}
              Procéder au paiement
            </button>
            
            <Link href="/cart" className="btn btn-outline w-full mt-3">
              Retour au panier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 