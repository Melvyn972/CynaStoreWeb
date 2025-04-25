"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Header from "@/components/Header";
export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState({});
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/cart');
        
        if (response.status === 401) {
          // User not logged in, redirect to login
          toast.error("Veuillez vous connecter pour voir votre panier");
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

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
          quantity: newQuantity,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      
      // Update local state
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      toast.success('Quantité mise à jour');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error("Erreur lors de la mise à jour de la quantité");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      // Update local state
      setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
      
      toast.success('Article supprimé du panier');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Erreur lors de la suppression de l'article");
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <Header />
        <h1 className="text-3xl font-bold mt-16 mb-8">Votre Panier</h1>
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
        <h1 className="text-3xl font-bold mt-16 mb-8">Votre Panier</h1>
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
      <h1 className="text-3xl font-bold mt-16 mb-8">Votre Panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto bg-base-100 dark:bg-gray-800 rounded-lg shadow">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="bg-base-200 dark:bg-gray-700">Article</th>
                  <th className="bg-base-200 dark:bg-gray-700 text-right">Prix</th>
                  <th className="bg-base-200 dark:bg-gray-700 text-center">Quantité</th>
                  <th className="bg-base-200 dark:bg-gray-700 text-right">Total</th>
                  <th className="bg-base-200 dark:bg-gray-700"></th>
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
                      <td className="flex items-center space-x-3">
                        {article.image ? (
                          <div className="w-16 h-16 relative">
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-base-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="font-bold">{article.title}</div>
                          <div className="text-sm opacity-50">{article.category}</div>
                        </div>
                      </td>
                      <td className="text-right">{article.price.toFixed(2)} €</td>
                      <td>
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="btn btn-xs btn-circle btn-ghost"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                            className="btn btn-xs btn-circle btn-ghost"
                            disabled={item.quantity >= 10}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right font-medium">{(article.price * item.quantity).toFixed(2)} €</td>
                      <td>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-ghost btn-circle btn-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-base-100 dark:bg-gray-800 p-6 rounded-lg shadow">
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
              onClick={() => router.push('/checkout')}
            >
              Procéder au paiement
            </button>
            
            <Link href="/articles" className="btn btn-outline w-full mt-3">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 