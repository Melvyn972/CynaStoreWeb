'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function NewCarouselSlide() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    displayOrder: '',
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Créer un objet FormData pour envoyer le fichier
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      formDataToSend.append('displayOrder', formData.displayOrder);
      formDataToSend.append('isActive', formData.isActive);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch('/api/admin/carousel', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création de la diapositive');
      }

      router.push('/dashboard/admin/carousel');
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
        {/* Header avec boutons de navigation */}
        <div className="flex items-center justify-between ios-fade-in">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/carousel"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au carrousel
            </Link>
            <div className="w-px h-8 bg-white/20"></div>
            <Link
              href="/dashboard/admin"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
              Tableau de bord admin
            </Link>
          </div>
          <div>
            <h1 className="ios-title text-3xl">
              Nouvelle Diapositive
            </h1>
            <p className="ios-body mt-2">
              Créez une nouvelle diapositive pour le carrousel
            </p>
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section informations */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Contenu de la diapositive
            </h2>

            <div className="space-y-6">
              <div className="ios-grid-2">
                <div className="space-y-2">
                  <label className="ios-label">
                    Titre principal *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="ios-input"
                    placeholder="Titre de la diapositive..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ios-label">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="ios-input"
                    placeholder="Sous-titre (optionnel)..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="ios-input resize-none"
                  rows="4"
                  placeholder="Description de la diapositive..."
                />
              </div>

              <div className="ios-grid-2">
                <div className="space-y-2">
                  <label className="ios-label">
                    Texte du bouton
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    className="ios-input"
                    placeholder="ex: En savoir plus, Acheter..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="ios-label">
                    Lien du bouton
                  </label>
                  <input
                    type="url"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleChange}
                    className="ios-input"
                    placeholder="https://exemple.com ou /page"
                  />
                </div>
              </div>

              <div className="ios-grid-2">
                <div className="space-y-2">
                  <label className="ios-label">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    className="ios-input"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 bg-transparent border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ios-label">
                    Diapositive active
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section image */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Image de la diapositive *
            </h2>

            <div className="space-y-6">
              {/* Aperçu de l'image */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden ios-glass-light">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Aperçu de la diapositive"
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-white text-lg">Aucune image sélectionnée</p>
                      <p className="text-white/70 text-sm">Ratio recommandé : 16:9</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contrôles de fichier */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="ios-button-secondary w-fit"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choisir une image
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview('');
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="ios-button-secondary w-fit"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer l'image
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-white/60">
                    Formats acceptés : JPG, PNG, GIF. Taille maximum : 5MB.
                  </p>
                  <p className="text-sm text-white/60">
                    Résolution recommandée : 1920x1080 pixels (ratio 16:9)
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-green-300">
                      ✓ Image sélectionnée : {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/admin/carousel"
              className="ios-button-secondary"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.title || !selectedFile}
              className="ios-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Créer la diapositive
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
