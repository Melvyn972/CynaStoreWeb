'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
export default function DeleteUser({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        
        if (!response.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la suppression de l\'utilisateur');
      }

      router.push('/dashboard/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-700 dark:text-gray-300">Chargement...</span>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-soft rounded-xl p-6">
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded" role="alert">
          <p className="font-medium">{error}</p>
          <Link href="/dashboard/admin" className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-soft rounded-xl overflow-hidden transition-all duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Supprimer l&apos;utilisateur</h1>
          <Link 
            href="/dashboard/admin" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 m-6 rounded" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-red-50 dark:bg-red-900/10 rounded-xl mb-6">
          <div className="text-red-600 dark:text-red-400 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Êtes-vous sûr ?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            Vous êtes sur le point de supprimer l&apos;utilisateur <span className="font-semibold">{user?.name || user?.email}</span>. 
            Cette action est irréversible et toutes les données associées seront perdues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
            <h3 className="font-medium mb-3 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">Détails de l&apos;utilisateur :</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Nom :</span> {user?.name || 'Non défini'}</p>
              <p><span className="font-medium">Email :</span> {user?.email}</p>
              <p><span className="font-medium">Rôle :</span> {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</p>
              <p><span className="font-medium">Accès :</span> {user?.hasAccess ? 'Oui' : 'Non'}</p>
              <p><span className="font-medium">Créé le :</span> {new Date(user?.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl flex items-center justify-center">
            {user?.image ? (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo de profil :</p>
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
                  <Image 
                    src={user.image} 
                    alt={user.name || user.email}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Pas de photo de profil</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard/admin"
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {deleting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Suppression...
              </span>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer l&apos;utilisateur
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 