"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import BackgroundEffects from "../components/BackgroundEffects";
import ThemeToggle from "../components/ThemeToggle";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState({});
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
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

  // Fetch user's companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const response = await fetch('/api/companies');
        
        if (!response.ok) {
          if (response.status !== 401) { // Ignore auth errors
            throw new Error('Failed to fetch companies');
          }
          return;
        }
        
        const companiesData = await response.json();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        // Don't show error to user, as companies are optional
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

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

  const handleCheckout = () => {
    if (selectedCompany) {
      // Redirect to company checkout
      router.push(`/checkout?company=${selectedCompany}`);
    } else {
      // Redirect to personal checkout
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <BackgroundEffects />
        <Header />
        <div className="relative z-20 pt-24 pb-12">
          <div className="ios-container">
            <div className="flex justify-between items-center mb-8">
              <h1 className="ios-title text-4xl">Votre Panier</h1>
              <ThemeToggle />
            </div>
            <div className="dashboard-card flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen relative">
        <BackgroundEffects />
        <Header />
        <div className="relative z-20 pt-24 pb-12">
          <div className="ios-container">
            <div className="flex justify-between items-center mb-8">
              <h1 className="ios-title text-4xl">Votre Panier</h1>
              <ThemeToggle />
            </div>
            <div className="dashboard-card text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Votre panier est vide</h2>
              <p className="ios-body mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
              <Link href="/articles" className="ios-button-primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Découvrir nos produits
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      <Header />
      <div className="relative z-20 pt-24 pb-12">
        <div className="ios-container space-y-8">
          {/* Header du panier */}
          <div className="ios-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h1 className="ios-title text-4xl">Votre Panier</h1>
              <ThemeToggle />
            </div>
            <p className="ios-body">
              {cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier
            </p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Articles du panier */}
            <div className="xl:col-span-2 space-y-4 ios-slide-up">
              {cart.map(item => {
                const article = articles[item.productId];
                
                if (!article) {
                  return null; // Skip if article not found
                }
                
                return (
                  <div key={item.id} className="ios-glass-light rounded-2xl p-6">
                    <div className="flex items-center gap-6">
                      {/* Image du produit */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="80px"
                            className="object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              {article.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Informations du produit */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                          {article.title}
                        </h3>
                        <p className="text-black/60 dark:text-white/60 text-sm mb-2">
                          {article.category}
                        </p>
                        <p className="text-purple-600 dark:text-purple-400 font-semibold">
                          {article.price.toFixed(2)} €
                        </p>
                      </div>
                      
                      {/* Contrôles de quantité */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-black/10 dark:bg-white/10 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center text-black dark:text-white transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-4 text-black dark:text-white font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                            className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center text-black dark:text-white transition-colors"
                            disabled={item.quantity >= 10}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Total ligne */}
                        <div className="text-right min-w-[5rem]">
                          <div className="text-lg font-bold text-black dark:text-white">
                            {(article.price * item.quantity).toFixed(2)} €
                          </div>
                        </div>
                        
                        {/* Bouton supprimer */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Bouton continuer les achats */}
              <div className="pt-4">
                <Link href="/articles" className="ios-button-secondary inline-flex">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continuer mes achats
                </Link>
              </div>
            </div>
            
            {/* Résumé de commande */}
            <div className="xl:col-span-1 ios-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="dashboard-card sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black dark:text-white">Résumé</h2>
                    <p className="ios-body text-sm">Votre commande</p>
                  </div>
                </div>
                
                {/* Détails financiers */}
                <div className="ios-glass-light rounded-2xl p-6 space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black/70 dark:text-white/70">Sous-total</span>
                    <span className="text-black dark:text-white font-medium">{calculateTotal()} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/70 dark:text-white/70">Livraison</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Gratuite</span>
                  </div>
                  <div className="border-t border-black/10 dark:border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-black dark:text-white">Total</span>
                      <span className="text-xl font-bold text-black dark:text-white">{calculateTotal()} €</span>
                    </div>
                  </div>
                </div>

                {/* Choix du compte d'achat */}
                {!loadingCompanies && companies.length > 0 && (
                  <div className="ios-glass-light rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Commander pour
                    </h3>
                    <select 
                      className="ios-input" 
                      value={selectedCompany || ""}
                      onChange={(e) => setSelectedCompany(e.target.value || null)}
                    >
                      <option value="">🟢 Mon compte personnel</option>
                      <optgroup label="🏢 Mes entreprises">
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                )}
                
                {/* Actions */}
                <div className="space-y-3">
                  <button 
                    className="ios-button-primary w-full" 
                    onClick={handleCheckout}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Procéder au paiement
                  </button>
                  
                  <Link href="/" className="ios-button-secondary w-full text-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Annuler
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 