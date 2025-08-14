'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";
import ImageCarouselManager from "@/components/ImageCarouselManager";

export default function EditArticle({ params }) {
  const { id } = params;
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    stock: '',
    subscriptionDuration: '',
  });
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]); // Images actuelles du produit
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [specificationsLoading, setSpecificationsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données au montage
  useEffect(() => {
    fetchArticle();
    fetchCategories();
    fetchSpecifications();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/admin/articles/${id}`);
      
      if (!response.ok) {
        throw new Error('Article non trouvé');
      }
      
      const article = await response.json();
      
      setFormData({
        title: article.title,
        description: article.description,
        categoryId: article.categoryId || '',
        price: article.price?.toString() || '',
        stock: article.stock?.toString() || '',
        subscriptionDuration: article.subscriptionDuration || '',
      });

      // Charger les spécifications sélectionnées
      if (article.specifications) {
        setSelectedSpecifications(article.specifications.map(spec => spec.technicalSpecificationId));
      }

      // Charger les images actuelles
      if (article.images) {
        try {
          const imagesData = JSON.parse(article.images);
          if (Array.isArray(imagesData)) {
            setCurrentImages(imagesData);
          }
        } catch (error) {
          console.error('Error parsing images:', error);
        }
      }

      // Image principale
      if (article.image) {
        setImagePreview(article.image);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Erreur lors du chargement des catégories');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSpecifications = async () => {
    try {
      setSpecificationsLoading(true);
      const response = await fetch('/api/admin/specifications');
      if (response.ok) {
        const data = await response.json();
        setSpecifications(data);
      } else {
        console.error('Erreur lors du chargement des spécifications');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSpecificationsLoading(false);
    }
  };

  const handleSpecificationChange = (specId, checked) => {
    if (checked) {
      setSelectedSpecifications(prev => [...prev, specId]);
    } else {
      setSelectedSpecifications(prev => prev.filter(id => id !== specId));
    }
  };

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
      // Validation
      if (!formData.categoryId) {
        throw new Error('Veuillez sélectionner une catégorie');
      }

      // Créer un objet FormData pour envoyer le fichier
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('subscriptionDuration', formData.subscriptionDuration);

      // Image principale (première image du carrousel ou fichier sélectionné ou image actuelle)
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      } else if (images.length > 0) {
        formDataToSend.append('image', images[0].file);
      }
      // Si pas de nouvelle image, garder l'actuelle (gérée côté serveur)

      // Images pour le carrousel (nouvelles images)
      if (images.length > 0) {
        images.forEach((image, index) => {
          formDataToSend.append(`carouselImage_${index}`, image.file);
          formDataToSend.append(`carouselImageAlt_${index}`, image.alt);
        });
        formDataToSend.append('carouselImageCount', images.length.toString());
      }

      // Images actuelles à conserver
      if (currentImages.length > 0) {
        formDataToSend.append('currentImages', JSON.stringify(currentImages));
      }

      // Spécifications techniques sélectionnées
      if (selectedSpecifications.length > 0) {
        formDataToSend.append('specifications', JSON.stringify(selectedSpecifications));
      }

      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        body: formDataToSend,
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
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container space-y-8 relative z-20">
          <div className="dashboard-card flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin"></div>
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
              <Link href="/dashboard/admin/articles" className="ios-button-secondary">
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
              Modifier l'<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">article</span>
            </h1>
            <p className="ios-body">
              Modifiez les informations de l'article
            </p>
          </div>
          <Link 
            href="/dashboard/admin/articles" 
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux articles
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
          {/* Section informations de l'article */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              Informations de l'article
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
                  placeholder="Nom de l'article"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="ios-input h-32 resize-none"
                  placeholder="Description détaillée de l'article"
                  required
                />
              </div>

              <div className="ios-grid-2">
                <div className="space-y-2">
                  <label className="ios-label">
                    Catégorie *
                  </label>
                  {categoriesLoading ? (
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white/60 text-sm">Chargement des catégories...</span>
                    </div>
                  ) : (
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="ios-input"
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {categories.length === 0 && !categoriesLoading && (
                    <p className="text-sm text-orange-400 mt-1">
                      Aucune catégorie créée. 
                      <Link href="/dashboard/admin/categories" className="text-purple-400 hover:text-purple-300 ml-1">
                        Créer une catégorie
                      </Link>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="ios-label">
                    Prix (€) *
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

              <div className="space-y-2">
                <label className="ios-label">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Durée d'abonnement
                  <span className="text-sm font-normal text-white/60 ml-2">(optionnel)</span>
                </label>
                <select
                  name="subscriptionDuration"
                  value={formData.subscriptionDuration}
                  onChange={handleChange}
                  className="ios-input"
                >
                  <option value="">Aucune (produit unique)</option>
                  <option value="1 mois">1 mois</option>
                  <option value="3 mois">3 mois</option>
                  <option value="6 mois">6 mois</option>
                  <option value="1 an">1 an</option>
                  <option value="2 ans">2 ans</option>
                  <option value="3 ans">3 ans</option>
                  <option value="Vie">À vie</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section spécifications techniques */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              Spécifications techniques
              <span className="text-sm font-normal text-white/60 ml-2">(optionnel)</span>
            </h2>

            {specificationsLoading ? (
              <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg">
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/60 text-sm">Chargement des spécifications...</span>
              </div>
            ) : specifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Aucune spécification disponible</h3>
                <p className="ios-body mb-4">
                  Aucune spécification technique n'a été créée.
                </p>
                <Link 
                  href="/dashboard/admin/specifications" 
                  className="ios-button-secondary"
                  target="_blank"
                >
                  Créer des spécifications
                </Link>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="ios-body text-sm">
                    Sélectionnez les caractéristiques techniques qui s'appliquent à ce produit :
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specifications.map((spec) => (
                    <label 
                      key={spec.id}
                      className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecifications.includes(spec.id)}
                        onChange={(e) => handleSpecificationChange(spec.id, e.target.checked)}
                        className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{spec.name}</div>
                        {spec.description && (
                          <div className="text-white/60 text-sm mt-1">{spec.description}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {selectedSpecifications.length > 0 && (
                  <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                    <h4 className="text-cyan-300 font-medium mb-2">
                      Spécifications sélectionnées ({selectedSpecifications.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpecifications.map((specId) => {
                        const spec = specifications.find(s => s.id === specId);
                        return spec ? (
                          <span 
                            key={spec.id}
                            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                          >
                            {spec.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section images du produit */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Images du produit
            </h2>

            {/* Images actuelles */}
            {currentImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Images actuelles
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-800">
                        <Image
                          src={img.url}
                          alt={img.alt || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          fill
                          sizes="96px"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ajouter de nouvelles images */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter de nouvelles images
              </h3>
              <ImageCarouselManager 
                images={images}
                onImagesChange={setImages}
                maxImages={5}
              />
            </div>

            {/* Option d'image simple (rétrocompatibilité) */}
            {images.length === 0 && currentImages.length === 0 && (
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ou ajouter une image simple
                </h3>
                
                <div className="flex items-start gap-8">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden ios-glass-light">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Aperçu de l'article"
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
                        {imagePreview ? 'Changer l\'image' : 'Ajouter une image simple'}
                      </button>
                      
                      {selectedFile && (
                        <p className="ios-body text-sm text-emerald-300">
                          ✓ Fichier sélectionné : {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard/admin/articles"
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
                  Mise à jour en cours...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mettre à jour l'article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}