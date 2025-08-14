"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ articleId, title, stock = 0 }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < Math.min(10, stock)) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: articleId,
          quantity: quantity
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }
      
      // Success
      toast.success(`${quantity} ${title} ajouté${quantity > 1 ? 's' : ''} au panier`);
      router.refresh(); // Refresh page to update cart count if displayed in header
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      
      if (error.message === 'Unauthorized') {
        toast.error("Veuillez vous connecter pour ajouter des articles au panier");
        router.push('/auth/login');
      } else {
        toast.error(error.message || "Impossible d'ajouter au panier. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Si pas de stock, afficher un bouton différent
  if (stock <= 0) {
    return (
      <div className="flex flex-col space-y-4 sm:flex-1">
        <button 
          disabled
          className="w-full ios-button-secondary justify-center opacity-50 cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
          Produit indisponible
        </button>
        <button className="w-full ios-button-primary justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 12.343l1.414 1.414L12 7.414l6.243 6.243 1.414-1.414L12 4.586z" />
          </svg>
          M'alerter du retour en stock
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 sm:flex-1">
      <div className="flex items-center">
        <button 
          onClick={decreaseQuantity}
          className="w-10 h-10 flex items-center justify-center rounded-l-lg border border-base-300 bg-base-100 text-base-content disabled:opacity-50"
          disabled={quantity <= 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <div className="w-12 h-10 flex items-center justify-center border-t border-b border-base-300 bg-base-100 text-base-content">
          {quantity}
        </div>
        
        <button 
          onClick={increaseQuantity}
          className="w-10 h-10 flex items-center justify-center rounded-r-lg border border-base-300 bg-base-100 text-base-content disabled:opacity-50"
          disabled={quantity >= Math.min(10, stock)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {stock > 0 && stock <= 5 && (
        <div className="text-orange-500 text-sm font-medium">
          ⚠️ Plus que {stock} en stock !
        </div>
      )}
      
      <button 
        onClick={addToCart}
        disabled={isLoading || stock <= 0}
        className="btn btn-primary flex-1 flex items-center justify-center text-white disabled:opacity-50"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
        {isLoading ? "Ajout en cours..." : "Ajouter au panier"}
      </button>
    </div>
  );
} 