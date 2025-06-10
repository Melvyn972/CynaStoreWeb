'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditArticle({ params }) {
  const router = useRouter();
  const { id } = params;
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    price: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/admin/articles/${id}`);
        
        if (!response.ok) {
          throw new Error('Article non trouvé');
        }
        
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          imageUrl: data.image || '',
          price: data.price || ''
        });
        
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Créer un objet FormData pour envoyer le fichier
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('currentImageUrl', formData.imageUrl);
      formDataToSend.append('price', formData.price);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        body: formDataToSend,
        // Ne pas définir l'en-tête Content-Type lors de l'envoi de FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour de l\'article');
      }

      router.push('/dashboard/admin/articles');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="ios-container">
          <div className="dashboard-card">
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-4 ios-body text-white">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="ios-container space-y-8">
        {/* Header avec boutons de navigation */}
        <div className="flex items-center justify-between ios-fade-in">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/articles"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux articles
            </Link>
            <div className="w-px h-8 bg-white/20"></div>
            <h1 className="ios-title text-2xl md:text-3xl">
              Modifier l&apos;article
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v6l3-3 3 3V5" />
              </svg>
              Admin
            </Link>
          </div>
        </div>

        {error && (
          <div className="ios-glass-error rounded-2xl p-6 ios-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 ios-slide-up">
          {/* Section informations de l'article */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              Informations de l&apos;article
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="ios-label">
                  Titre
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="Nom de l&apos;article"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="ios-input h-32 resize-none"
                  placeholder="Description détaillée de l&apos;article"
                  required
                />
              </div>

              <div className="ios-grid-2">
                <div className="space-y-2">
                  <label className="ios-label">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="ios-input"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="electronique">Électronique</option>
                    <option value="vetements">Vêtements</option>
                    <option value="maison">Maison & Jardin</option>
                    <option value="sports">Sports & Loisirs</option>
                    <option value="beaute">Beauté & Santé</option>
                    <option value="livres">Livres & Médias</option>
                    <option value="alimentation">Alimentation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="ios-label">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="ios-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
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
              Image de l&apos;article
            </h2>

            <div className="flex items-start gap-8">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden ios-glass-light">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Aperçu de l&apos;article"
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
                    {imagePreview ? 'Changer l&apos;image' : 'Ajouter une image'}
                  </button>
                  
                  {selectedFile && (
                    <p className="ios-body text-sm text-emerald-300">
                      ✓ Nouveau fichier : {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <div className="ios-glass-light rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">Conseils pour l&apos;image :</h4>
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
              href="/dashboard/admin/articles"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Annuler
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="ios-button-primary"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 