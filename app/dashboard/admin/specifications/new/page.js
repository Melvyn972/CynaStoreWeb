'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function NewSpecification() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await fetch('/api/admin/specifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création de la spécification');
      }

      router.push('/dashboard/admin/specifications');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl mb-2">
              Nouvelle <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">spécification</span>
            </h1>
            <p className="ios-body">
              Créez une nouvelle caractéristique technique
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

          {/* Exemples */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Exemples de spécifications techniques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-300 font-medium mb-2">Hardware</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Processeur</li>
                  <li>• Mémoire RAM</li>
                  <li>• Stockage SSD/HDD</li>
                  <li>• Carte graphique</li>
                </ul>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <h4 className="text-purple-300 font-medium mb-2">Software</h4>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Système d'exploitation</li>
                  <li>• Version du logiciel</li>
                  <li>• Langues supportées</li>
                  <li>• API compatibles</li>
                </ul>
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
                  Création...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer la spécification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
