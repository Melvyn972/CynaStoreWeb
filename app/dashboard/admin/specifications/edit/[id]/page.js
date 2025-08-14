'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function EditSpecification({ params }) {
  const { id } = params;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpecification();
  }, [id]);

  const fetchSpecification = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/admin/specifications/${id}`);
      
      if (!response.ok) {
        throw new Error('Spécification non trouvée');
      }
      
      const spec = await response.json();
      
      setFormData({
        name: spec.name,
        description: spec.description || '',
        isActive: spec.isActive,
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/specifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour de la spécification');
      }

      router.push('/dashboard/admin/specifications');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container space-y-8 relative z-20">
          <div className="dashboard-card flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container space-y-8 relative z-20">
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/admin/specifications" className="ios-button-secondary">
                Retour à la liste
              </Link>
            </div>
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
            <h1 className="ios-title text-4xl mb-2">
              Modifier la <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">spécification</span>
            </h1>
            <p className="ios-body">
              Modifiez les informations de la spécification technique
            </p>
          </div>
          <Link 
            href="/dashboard/admin/specifications" 
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 ios-slide-up">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 ios-slide-up">
          {/* Section informations de la spécification */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              Informations de la spécification
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="ios-label">
                  Nom de la spécification *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="Ex: Processeur, RAM, Stockage, etc."
                  required
                />
                <p className="text-sm text-white/60">
                  Nom unique de la caractéristique technique
                </p>
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="ios-input h-24 resize-none"
                  placeholder="Description détaillée de cette spécification (optionnel)"
                />
                <p className="text-sm text-white/60">
                  Description optionnelle pour clarifier l'usage de cette spécification
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ios-label mb-0">
                  Spécification active
                </label>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard/admin/specifications"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Annuler
            </Link>
            
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className={`ios-button-primary ${loading || !formData.name.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mise à jour...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mettre à jour la spécification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
