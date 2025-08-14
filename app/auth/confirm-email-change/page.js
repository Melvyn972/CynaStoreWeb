"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import BackgroundEffects from "@/app/components/BackgroundEffects";

const ConfirmEmailChangePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de confirmation manquant');
      return;
    }

    confirmEmailChange();
  }, [token]);

  const confirmEmailChange = async () => {
    try {
      const response = await fetch(`/api/user/email-change?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setNewEmail(data.newEmail);
        
        // Déconnecter l'utilisateur pour qu'il se reconnecte avec le nouvel email
        setTimeout(() => {
          signOut({ callbackUrl: '/auth/login?message=email-updated' });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de la confirmation');
      }
    } catch (error) {
      console.error('Error confirming email change:', error);
      setStatus('error');
      setMessage('Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      <BackgroundEffects />
      
      <div className="relative z-20 w-full max-w-md">
        <div className="dashboard-card text-center">
          
          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Confirmation en cours...
              </h1>
              <p className="ios-body">
                Nous vérifions votre demande de changement d'email.
              </p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Email mis à jour !
              </h1>
              
              <p className="ios-body mb-4">
                {message}
              </p>
              
              {newEmail && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
                  <p className="text-green-300 text-sm">
                    Votre nouvelle adresse email : <strong>{newEmail}</strong>
                  </p>
                </div>
              )}
              
              <p className="text-sm text-white/60 mb-6">
                Vous allez être déconnecté dans quelques secondes pour vous permettre de vous reconnecter avec votre nouvelle adresse.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/login?message=email-updated' })}
                  className="ios-button-primary w-full"
                >
                  Se reconnecter maintenant
                </button>
                
                <Link
                  href="/dashboard"
                  className="ios-button-secondary w-full text-center"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Erreur de confirmation
              </h1>
              
              <p className="ios-body mb-6">
                {message}
              </p>
              
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm">
                  Le lien de confirmation peut avoir expiré ou être invalide.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard/profile"
                  className="ios-button-primary w-full text-center"
                >
                  Faire une nouvelle demande
                </Link>
                
                <Link
                  href="/dashboard"
                  className="ios-button-secondary w-full text-center"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/60">
            Besoin d'aide ? <Link href="/contact" className="text-purple-400 hover:text-purple-300">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailChangePage;
