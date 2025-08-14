'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function CarouselAdmin() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/carousel');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des diapositives');
      }
      
      const data = await response.json();
      setSlides(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides[draggedItem];
    
    // Remove the dragged item
    newSlides.splice(draggedItem, 1);
    
    // Insert at new position
    newSlides.splice(dropIndex, 0, draggedSlide);
    
    // Update display order
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      displayOrder: index
    }));
    
    setSlides(updatedSlides);
    setDraggedItem(null);
    
    // Save new order to server
    updateSlidesOrder(updatedSlides);
  };

  const updateSlidesOrder = async (updatedSlides) => {
    try {
      const response = await fetch('/api/admin/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides: updatedSlides.map(slide => ({
            id: slide.id,
            displayOrder: slide.displayOrder
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'ordre');
      }
    } catch (err) {
      setError(err.message);
      // Revert to original order
      fetchSlides();
    }
  };

  const deleteSlide = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette diapositive ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/carousel/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchSlides();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container space-y-8 relative z-20">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
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
              Gestion du Carrousel
            </h1>
            <p className="ios-body text-lg mt-2">
              Gérez les diapositives du carrousel de la page d'accueil
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour Admin
            </Link>
            <Link
              href="/dashboard/admin/carousel/new"
              className="ios-button-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle diapositive
            </Link>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 text-red-300">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="ios-grid-3 ios-slide-up mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {slides.length}
                </div>
                <div className="ios-body">Total diapositives</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {slides.filter(slide => slide.isActive).length}
                </div>
                <div className="ios-body">Diapositives actives</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {slides.filter(slide => !slide.isActive).length}
                </div>
                <div className="ios-body">Diapositives inactives</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des diapositives */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Toutes les diapositives ({slides.length})
            </h2>
            <Link href="/dashboard/admin/carousel/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle diapositive
            </Link>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="ios-body">Aucune diapositive trouvée</p>
              <Link
                href="/dashboard/admin/carousel/new"
                className="ios-button-primary mt-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer la première diapositive
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-white/60 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Glissez-déposez pour réorganiser l'ordre d'affichage
              </div>
              
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="ios-glass-light rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 cursor-move"
                >
                  <div className="flex items-center gap-6">
                    {/* Icône de drag */}
                    <div className="text-white/40 group-hover:text-white/70 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>

                    {/* Image de la diapositive */}
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        width={96}
                        height={64}
                      />
                    </div>

                    {/* Informations de la diapositive */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {slide.title}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          slide.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {slide.isActive ? 'Active' : 'Inactive'}
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                          Position: {slide.displayOrder + 1}
                        </div>
                      </div>
                      {slide.subtitle && (
                        <p className="text-sm text-white/80 mb-1">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.description && (
                        <p className="ios-body text-sm text-white/70 mb-2 line-clamp-2">
                          {slide.description}
                        </p>
                      )}
                      {slide.buttonText && (
                        <div className="text-xs text-white/50">
                          Bouton: {slide.buttonText} → {slide.buttonLink || '#'}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/dashboard/admin/carousel/edit/${slide.id}`}
                        className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => deleteSlide(slide.id)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
