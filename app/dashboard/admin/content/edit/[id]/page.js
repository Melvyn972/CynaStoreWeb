'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function EditContentBlock({ params }) {
  const { id } = params;
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    blockType: 'text',
    pageLocation: 'homepage',
    displayOrder: '',
    isActive: true,
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  const blockTypes = [
    { value: 'text', label: 'Texte seul' },
    { value: 'image', label: 'Image seule' },
    { value: 'text_image', label: 'Texte + Image' },
    { value: 'hero', label: 'Hero Section' },
    { value: 'feature', label: 'Fonctionnalité' },
    { value: 'testimonial', label: 'Témoignage' }
  ];

  const pageLocations = [
    { value: 'homepage', label: 'Page d\'accueil' },
    { value: 'about', label: 'À propos' },
    { value: 'contact', label: 'Contact' },
    { value: 'services', label: 'Services' }
  ];

  useEffect(() => {
    fetchContentBlock();
  }, [id]);

  const fetchContentBlock = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/admin/content/${id}`);
      
      if (!response.ok) {
        throw new Error('Bloc de contenu non trouvé');
      }
      
      const block = await response.json();
      
      setFormData({
        title: block.title,
        content: block.content,
        blockType: block.blockType,
        pageLocation: block.pageLocation,
        displayOrder: block.displayOrder?.toString() || '',
        isActive: block.isActive,
      });
      
      if (block.image) {
        setCurrentImageUrl(block.image);
        setImagePreview(block.image);
      }
      
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
      formDataToSend.append('content', formData.content);
      formDataToSend.append('blockType', formData.blockType);
      formDataToSend.append('pageLocation', formData.pageLocation);
      formDataToSend.append('displayOrder', formData.displayOrder);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('currentImageUrl', currentImageUrl);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour du bloc');
      }

      router.push('/dashboard/admin/content');
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
            <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
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
              <Link href="/dashboard/admin/content" className="ios-button-secondary">
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
              Modifier le <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">bloc</span>
            </h1>
            <p className="ios-body">
              Modifiez les informations du bloc de contenu
            </p>
          </div>
          <Link 
            href="/dashboard/admin/content" 
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
          {/* Section informations du bloc */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Informations du bloc
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="ios-label">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="Titre du bloc de contenu"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Type de bloc *
                </label>
                <select
                  name="blockType"
                  value={formData.blockType}
                  onChange={handleChange}
                  className="ios-input"
                  required
                >
                  {blockTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Contenu *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="ios-input resize-none"
                  rows="6"
                  placeholder="Contenu du bloc (supports HTML basique)..."
                  required
                />
                <p className="text-sm text-white/60">
                  Vous pouvez utiliser du HTML basique : &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                </p>
              </div>

              <div className="ios-grid-3">
                <div className="space-y-2">
                  <label className="ios-label">
                    Page de destination
                  </label>
                  <select
                    name="pageLocation"
                    value={formData.pageLocation}
                    onChange={handleChange}
                    className="ios-input"
                  >
                    {pageLocations.map(page => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label className="ios-label mb-0">
                    Bloc actif
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
              Image du bloc
              <span className="text-sm font-normal text-white/60 ml-2">(optionnel)</span>
            </h2>

            <div className="flex items-start gap-8">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden ios-glass-light">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Aperçu du bloc"
                    className="w-full h-full object-cover"
                    fill
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="ios-button-secondary w-fit"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
                  </button>
                  
                  {selectedFile && (
                    <p className="ios-body text-sm text-emerald-300">
                      ✓ Nouveau fichier sélectionné : {selectedFile.name}
                    </p>
                  )}
                  
                  {currentImageUrl && !selectedFile && (
                    <p className="ios-body text-sm text-blue-300">
                      ✓ Image actuelle conservée
                    </p>
                  )}
                </div>
                
                <div className="ios-glass-light rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">Conseils pour l'image :</h4>
                  <ul className="ios-body text-xs space-y-1">
                    <li>• Format : PNG, JPG ou GIF</li>
                    <li>• Taille maximale : 5MB</li>
                    <li>• Résolution recommandée : 800x600px</li>
                    <li>• Fond uni ou transparent de préférence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard/admin/content"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Annuler
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className={`ios-button-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  Mettre à jour le bloc
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
