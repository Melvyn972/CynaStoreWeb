'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function ContentAdmin() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchBlocks();
  }, [selectedPage]);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/content?pageLocation=${selectedPage}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des blocs de contenu');
      }
      
      const data = await response.json();
      setBlocks(data);
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

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedItem];
    
    // Remove the dragged item
    newBlocks.splice(draggedItem, 1);
    
    // Insert at new position
    newBlocks.splice(dropIndex, 0, draggedBlock);
    
    // Update display order
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      displayOrder: index
    }));
    
    setBlocks(updatedBlocks);
    setDraggedItem(null);
    
    // Save new order to server
    updateBlocksOrder(updatedBlocks);
  };

  const updateBlocksOrder = async (updatedBlocks) => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks: updatedBlocks.map(block => ({
            id: block.id,
            displayOrder: block.displayOrder
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'ordre');
      }
    } catch (err) {
      setError(err.message);
      // Revert to original order
      fetchBlocks();
    }
  };

  const deleteBlock = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bloc de contenu ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchBlocks();
    } catch (err) {
      setError(err.message);
    }
  };

  const getBlockTypeLabel = (type) => {
    const types = {
      'text': 'Texte',
      'image': 'Image',
      'text_image': 'Texte + Image',
      'hero': 'Hero Section',
      'feature': 'Fonctionnalité',
      'testimonial': 'Témoignage'
    };
    return types[type] || type;
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
              Gestion du Contenu
            </h1>
            <p className="ios-body text-lg mt-2">
              Gérez les blocs de contenu des pages du site
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
              href="/dashboard/admin/content/new"
              className="ios-button-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau bloc
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

        {/* Sélecteur de page */}
        <div className="dashboard-card">
          <div className="flex items-center gap-4 mb-6">
            <label className="ios-label">Page :</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="ios-input max-w-xs"
            >
              <option value="homepage">Page d'accueil</option>
              <option value="about">À propos</option>
              <option value="contact">Contact</option>
              <option value="services">Services</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="ios-grid-3 ios-slide-up mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {blocks.length}
                </div>
                <div className="ios-body">Total blocs</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-2">
                  {blocks.filter(block => block.isActive).length}
                </div>
                <div className="ios-body">Blocs actifs</div>
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
                  {blocks.filter(block => block.image).length}
                </div>
                <div className="ios-body">Avec images</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des blocs de contenu */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Blocs de contenu - {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} ({blocks.length})
            </h2>
            <Link href="/dashboard/admin/content/new" className="ios-button-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau bloc
            </Link>
          </div>

          {blocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="ios-body">Aucun bloc de contenu trouvé pour cette page</p>
              <Link
                href="/dashboard/admin/content/new"
                className="ios-button-primary mt-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer le premier bloc
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
              
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="ios-glass-light rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 cursor-move"
                >
                  <div className="flex items-start gap-6">
                    {/* Icône de drag */}
                    <div className="text-white/40 group-hover:text-white/70 transition-colors mt-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>

                    {/* Image du bloc (si disponible) */}
                    {block.image && (
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0">
                        <Image
                          src={block.image}
                          alt={block.title}
                          className="w-full h-full object-cover"
                          width={96}
                          height={64}
                        />
                      </div>
                    )}

                    {/* Informations du bloc */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {block.title}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          block.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {block.isActive ? 'Actif' : 'Inactif'}
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                          {getBlockTypeLabel(block.blockType)}
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300">
                          Position: {block.displayOrder + 1}
                        </div>
                      </div>
                      <p className="ios-body text-sm text-white/70 mb-2 line-clamp-3">
                        {block.content.length > 200 
                          ? `${block.content.substring(0, 200)}...` 
                          : block.content
                        }
                      </p>
                      <div className="text-xs text-white/50">
                        Page: {block.pageLocation}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/dashboard/admin/content/edit/${block.id}`}
                        className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => deleteBlock(block.id)}
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
