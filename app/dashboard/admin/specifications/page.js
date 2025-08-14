'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function SpecificationsAdmin() {
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchSpecifications();
  }, [showInactive]);

  const fetchSpecifications = async () => {
    try {
      setLoading(true);
      const params = showInactive ? '?includeInactive=true' : '';
      const response = await fetch(`/api/admin/specifications${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des spécifications');
      }
      
      const data = await response.json();
      setSpecifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecificationStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/specifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: specifications.find(s => s.id === id).name,
          description: specifications.find(s => s.id === id).description,
          isActive: !currentStatus 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour la liste
      setSpecifications(prev => prev.map(spec => 
        spec.id === id ? { ...spec, isActive: !currentStatus } : spec
      ));

    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const deleteSpecification = async (id) => {
    const spec = specifications.find(s => s.id === id);
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la spécification "${spec.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/specifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      // Mettre à jour la liste
      setSpecifications(prev => prev.filter(spec => spec.id !== id));

    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl mb-2">
              Spécifications <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">techniques</span>
            </h1>
            <p className="ios-body">
              Gérez les caractéristiques techniques de vos produits
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/admin/specifications/new" 
              className="ios-button-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle spécification
            </Link>
            <Link 
              href="/dashboard/admin" 
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>
        </div>

        {/* Filtres */}
        <div className="dashboard-card ios-slide-up">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Affichage :</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-white/70">Inclure les spécifications inactives</span>
            </label>
          </div>
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

        {/* Liste des spécifications */}
        {loading ? (
          <div className="dashboard-card flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : specifications.length === 0 ? (
          <div className="dashboard-card text-center py-16">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune spécification</h3>
            <p className="ios-body mb-6">
              Commencez par créer votre première spécification technique.
            </p>
            <Link href="/dashboard/admin/specifications/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une spécification
            </Link>
          </div>
        ) : (
          <div className="space-y-4 ios-slide-up">
            {specifications.map((spec) => (
              <div
                key={spec.id}
                className={`dashboard-card border-l-4 ${
                  spec.isActive ? 'border-l-green-500' : 'border-l-gray-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{spec.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        spec.isActive 
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {spec.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {spec._count?.articles || 0} produit{(spec._count?.articles || 0) > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {spec.description && (
                      <p className="text-white/70 mb-3">{spec.description}</p>
                    )}
                    
                    <div className="text-sm text-white/50">
                      Créé le {formatDate(spec.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/dashboard/admin/specifications/edit/${spec.id}`}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Modifier
                    </Link>
                    
                    <button
                      onClick={() => toggleSpecificationStatus(spec.id, spec.isActive)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        spec.isActive
                          ? 'bg-gray-500 hover:bg-gray-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {spec.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    
                    <button
                      onClick={() => deleteSpecification(spec.id)}
                      disabled={(spec._count?.articles || 0) > 0}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        (spec._count?.articles || 0) > 0
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      title={(spec._count?.articles || 0) > 0 ? 'Impossible de supprimer : utilisé par des produits' : 'Supprimer'}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
