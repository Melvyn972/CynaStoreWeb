'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackgroundEffects from '@/app/components/BackgroundEffects';
import toast from 'react-hot-toast';

export default function DeleteCategory({ params }) {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${params.id}`);
      if (!response.ok) {
        throw new Error('Catégorie non trouvée');
      }
      const data = await response.json();
      setCategory(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de la catégorie');
      router.push('/dashboard/admin/categories');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      toast.success('Catégorie supprimée avec succès !');
      router.push('/dashboard/admin/categories');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la suppression de la catégorie');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container relative z-20">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="ios-body mt-4">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container relative z-20">
          <div className="text-center py-20">
            <p className="ios-body">Catégorie non trouvée</p>
            <Link href="/dashboard/admin/categories" className="ios-button-secondary mt-4 inline-flex">
              Retour aux catégories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl">
              Supprimer la Catégorie
            </h1>
            <p className="ios-body text-lg mt-2">
              Confirmez la suppression de cette catégorie
            </p>
          </div>
          <Link
            href="/dashboard/admin/categories"
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>

        {/* Carte de confirmation */}
        <div className="dashboard-card ios-slide-up">
          <div className="text-center space-y-6">
            {/* Icône d'avertissement */}
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Message d'avertissement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Attention !
              </h2>
              <p className="ios-body text-lg">
                Vous êtes sur le point de supprimer définitivement la catégorie :
              </p>
            </div>

            {/* Détails de la catégorie */}
            <div className="bg-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-center gap-4">
                {category.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="ios-body text-sm mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <span>
                  📊 {category._count?.articles || 0} article(s)
                </span>
                <span>
                  📍 Ordre: {category.displayOrder}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  category.isActive 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-red-500/20 text-red-600'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Avertissement supplémentaire */}
            {category._count?.articles > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  ⚠️ <strong>Attention :</strong> Cette catégorie contient {category._count.articles} article(s). 
                  Vous devez d'abord déplacer ou supprimer ces articles avant de pouvoir supprimer la catégorie.
                </p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              {category._count?.articles > 0 ? (
                <div className="flex-1">
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-2xl bg-gray-500/50 text-gray-400 cursor-not-allowed font-medium"
                  >
                    Impossible de supprimer
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Cette catégorie contient des articles
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Suppression...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Oui, supprimer définitivement
                    </>
                  )}
                </button>
              )}
              
              <Link
                href="/dashboard/admin/categories"
                className="flex-1 py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-900 dark:text-white font-medium transition-all text-center"
              >
                Annuler
              </Link>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cette action est irréversible. Toutes les données associées seront perdues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
