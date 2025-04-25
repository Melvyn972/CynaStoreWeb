"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'

  // Verify the checkout session
  useEffect(() => {
    const verifyCheckout = async () => {
      if (!sessionId) {
        // No session ID, redirect to home after a delay
        toast.error("Paramètres de confirmation manquants");
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        // Call our verification endpoint
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify session');
        }
        
        const data = await response.json();
        
        if (data.paymentSuccessful) {
          setVerificationStatus('success');
          
          // Clear the cart directly from the client side
          try {
            await clearCart();
          } catch (err) {
            console.error('Error clearing cart:', err);
            // Continue anyway, as the purchase was successful
          }
        } else {
          // Payment is still processing or failed
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error verifying checkout:', error);
        setVerificationStatus('error');
        toast.error("Erreur lors de la vérification du paiement");
      }
    };

    verifyCheckout();
  }, [sessionId, router]);

  // Function to clear the cart
  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      console.log('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Redirect to home after 5 seconds only if successful
  useEffect(() => {
    if (verificationStatus === 'success') {
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [verificationStatus, router]);

  if (verificationStatus === 'pending') {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <Header />
        
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="bg-base-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Vérification du paiement...</h1>
            <p className="text-base-content/70 dark:text-gray-300 mb-6">
              Veuillez patienter pendant que nous vérifions votre paiement.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <Header />
        
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="bg-base-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">Problème de vérification</h1>
            
            <p className="text-base-content/70 dark:text-gray-300 mb-6">
              Nous n&apos;avons pas pu vérifier votre paiement. Si vous avez déjà été débité, veuillez nous contacter.
            </p>
            
            <div className="space-y-3">
              <Link href="/dashboard#articles" className="btn btn-primary w-full">
                Voir mes achats
              </Link>
              
              <Link href="/" className="btn btn-outline w-full">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <Header />
      
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="bg-base-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Paiement réussi !</h1>
          
          <p className="text-base-content/70 dark:text-gray-300 mb-6">
            Merci pour votre achat. Votre commande a été traitée avec succès et vous recevrez bientôt une confirmation par email.
          </p>
          
          <div className="space-y-3">
            <Link href="/dashboard#articles" className="btn btn-primary w-full">
              Voir mes achats
            </Link>
            
            <Link href="/" className="btn btn-outline w-full">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 