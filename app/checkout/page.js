"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import apiClient from "@/libs/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [company, setCompany] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company');

  // Fetch company details if companyId is provided
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;
      
      try {
        const response = await fetch(`/api/companies/${companyId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch company details');
        }
        
        const companyData = await response.json();
        console.log('Checkout - Company API response:', companyData);
        
        // Handle the nested response structure and field mapping
        const company = companyData.company || companyData;
        console.log('Checkout - Extracted company:', company);
        
        // Map API fields to expected frontend fields
        const mappedCompany = {
          ...company,
          vatNumber: company.vatNumber || company.tva,
          siretNumber: company.siretNumber || company.siret
        };
        
        console.log('Checkout - Mapped company:', mappedCompany);
        setCompany(mappedCompany);
      } catch (error) {
        console.error('Error fetching company details:', error);
        toast.error("Erreur lors du chargement des détails de l'entreprise");
        router.push('/cart'); // Redirect back to cart if company doesn't exist
      }
    };

    fetchCompanyDetails();
  }, [companyId, router]);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Use personal cart for both personal and company orders
        // The company selection affects the order processing, not the cart itself
        const endpoint = '/api/cart';
          
        const response = await fetch(endpoint);
        
        if (response.status === 401) {
          // User not logged in, redirect to login
          toast.error("Veuillez vous connecter pour finaliser votre commande");
          router.push('/auth/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const cartData = await response.json();
        console.log('Checkout - Cart API response:', cartData);
        
        // Extract cart items array from the API response
        let validCartItems = [];
        if (cartData && Array.isArray(cartData.items)) {
          validCartItems = cartData.items;
          setCart(cartData.items);
          console.log('Checkout - Using cartData.items:', validCartItems);
        } else if (Array.isArray(cartData)) {
          // Handle case where API returns array directly (for backward compatibility)
          validCartItems = cartData;
          setCart(cartData);
          console.log('Checkout - Using cartData directly:', validCartItems);
        } else {
          console.error('Checkout - Cart API returned invalid format:', cartData);
          setCart([]);
          toast.error("Format de données du panier invalide");
          return; // Exit early if data is invalid
        }
        
        // Get unique product IDs - handle both productId and product.id formats
        const productIds = [...new Set(validCartItems.map(item => item.productId || item.product?.id))];
        
        // Fetch product details
        if (productIds.length > 0) {
          const articlesRes = await fetch(`/api/articles?ids=${productIds.join(',')}`);
          if (!articlesRes.ok) {
            throw new Error('Failed to fetch product details');
          }
          const articlesResponse = await articlesRes.json();
          
          // Extract articles array from the API response
          let articlesArray = [];
          if (articlesResponse && Array.isArray(articlesResponse.articles)) {
            articlesArray = articlesResponse.articles;
          } else if (Array.isArray(articlesResponse)) {
            // Handle case where API returns array directly (for backward compatibility)
            articlesArray = articlesResponse;
          } else {
            console.error('Articles API returned invalid format:', articlesResponse);
            articlesArray = [];
          }
          
          // Convert to lookup object
          const articlesLookup = {};
          articlesArray.forEach(article => {
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
  }, [companyId, router]);

  // Calculate total
  const calculateTotal = () => {
    if (!Array.isArray(cart)) {
      return "0.00";
    }
    return cart.reduce((total, item) => {
      const productId = item.productId || item.product?.id;
      const article = articles[productId];
      if (article) {
        return total + (article.price * item.quantity);
      }
      return total;
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    // Validations avant traitement
    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    // Vérifier la disponibilité des produits
    const unavailableItems = [];
    const lineItems = [];

    for (const item of cart) {
      const productId = item.productId || item.product?.id;
      const article = articles[productId];
      
      if (!article) {
        unavailableItems.push(`Produit non trouvé: ${productId}`);
        continue;
      }

      if ((article.stock || 0) < item.quantity) {
        unavailableItems.push(`${article.title}: seulement ${article.stock || 0} en stock, vous en demandez ${item.quantity}`);
        continue;
      }

      lineItems.push({
        productId: productId,
        quantity: item.quantity,
        price: article.price
      });
    }

    if (unavailableItems.length > 0) {
      toast.error(`Articles indisponibles:\n${unavailableItems.join('\n')}`);
      return;
    }

    if (lineItems.length === 0) {
      toast.error("Aucun article valide dans votre panier");
      return;
    }

    // Calculer le total pour vérification
    const total = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (total <= 0) {
      toast.error("Le montant total doit être supérieur à 0€");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create Stripe checkout session
      const endpoint = companyId
        ? '/api/stripe/create-company-checkout'
        : '/api/stripe/create-cart-checkout';
      
      const payload = {
        lineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cart`,
      };
      
      // Add companyId if buying for a company
      if (companyId) {
        payload.companyId = companyId;
      }

      const response = await apiClient.post(endpoint, payload);

      if (response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error("Erreur lors de la création de la session de paiement");
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // Messages d'erreur plus spécifiques
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message.includes('fetch')) {
        toast.error("Erreur de connexion. Vérifiez votre connexion internet.");
      } else {
        toast.error("Erreur lors de la création de la session de paiement. Veuillez réessayer.");
      }
      
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

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <Header />
        <h1 className="text-3xl font-bold mt-16 mb-8">
          Finalisation de la commande
          {company && (
            <span className="text-xl font-normal ml-2 text-gray-600 dark:text-gray-400">
              pour {company.name}
            </span>
          )}
        </h1>
        <div className="flex flex-col items-center justify-center py-12 bg-base-200 dark:bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/50 dark:text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-base-content/70 dark:text-gray-300 text-xl mb-2">Votre panier est vide</p>
          {companyId && (
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-4 text-center">
              💡 Pour commander en mode entreprise, ajoutez d'abord des articles à votre panier personnel,<br/>
              puis sélectionnez l'entreprise au moment du paiement.
            </p>
          )}
          <div className="flex gap-4">
            <Link 
              href="/articles" 
              className="btn btn-primary"
            >
              Continuer mes achats
            </Link>
            <Link 
              href="/cart" 
              className="btn btn-secondary"
            >
              Retour au panier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <Header />
      <h1 className="text-3xl font-bold mt-16 mb-8">
        Finalisation de la commande
        {company && (
          <span className="text-xl font-normal ml-2 text-gray-600 dark:text-gray-400">
            pour {company.name}
          </span>
        )}
      </h1>
      
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
                  {Array.isArray(cart) && cart.map(item => {
                    const productId = item.productId || item.product?.id;
                    const article = articles[productId];
                    
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

          {company && (
            <div className="bg-base-100 dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Informations de l&apos;entreprise</h2>
              
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-32">Nom:</span> 
                  <span className="text-gray-800 dark:text-white">{company.name}</span>
                </div>
                {company.email && (
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-32">Email:</span> 
                    <span className="text-gray-800 dark:text-white">{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-32">Téléphone:</span> 
                    <span className="text-gray-800 dark:text-white">{company.phone}</span>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-32">Adresse:</span> 
                    <span className="text-gray-800 dark:text-white">{company.address}</span>
                  </div>
                )}
                {company.vatNumber && (
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-32">N° TVA:</span> 
                    <span className="text-gray-800 dark:text-white">{company.vatNumber}</span>
                  </div>
                )}
                {company.siretNumber && (
                  <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-32">SIRET:</span> 
                    <span className="text-gray-800 dark:text-white">{company.siretNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
                {company && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Facturation à: {company.name}
                  </div>
                )}
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
      
      <Footer />
    </div>
  );
} 