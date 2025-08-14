'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";
import toast from 'react-hot-toast';

export default function EditCarouselSlide({ params }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    fetchSlide();
  }, [params.id]);

  const fetchSlide = async () => {
    try {
      const response = await fetch(`/api/admin/carousel/${params.id}`);
      if (!response.ok) {
        throw new Error('Diapositive non trouvée');
      }
      const data = await response.json();
      setSlide(data);
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        buttonText: data.buttonText || '',
        buttonLink: data.buttonLink || '',
        displayOrder: data.displayOrder || '',
        isActive: data.isActive,
      });
      setCurrentImage(data.image);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de la diapositive');
      router.push('/dashboard/admin/carousel');
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
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      formDataToSend.append('displayOrder', formData.displayOrder.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('currentImageUrl', currentImage || '');
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch(`/api/admin/carousel/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      toast.success('Diapositive mise à jour avec succès !');
      router.push('/dashboard/admin/carousel');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour de la diapositive');
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl">
              Modifier la Diapositive
            </h1>
            <p className="ios-body text-lg mt-2">
              Modifiez les informations de la diapositive
            </p>
          </div>
          <Link
            href="/dashboard/admin/carousel"
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>

        {/* Formulaire */}
        <div className="dashboard-card ios-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="ios-label">
                Titre *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="ios-input"
                placeholder="Entrez le titre de la diapositive"
              />
            </div>

            {/* Sous-titre */}
            <div>
              <label htmlFor="subtitle" className="ios-label">
                Sous-titre
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="ios-input"
                placeholder="Sous-titre (optionnel)"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="ios-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="ios-input resize-none"
                placeholder="Description de la diapositive (optionnel)"
              />
            </div>

            {/* Image actuelle */}
            {currentImage && (
              <div>
                <label className="ios-label">
                  Image actuelle
                </label>
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={currentImage}
                    alt="Image actuelle"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            )}

            {/* Upload nouvelle image */}
            <div>
              <label htmlFor="image" className="ios-label">
                {currentImage ? 'Changer l\'image' : 'Image de la diapositive *'}
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  id="image"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="ios-input"
                />
                
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="ios-grid-2">
              <div>
                <label htmlFor="buttonText" className="ios-label">
                  Texte du bouton
                </label>
                <input
                  type="text"
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="ex: En savoir plus, Acheter..."
                />
              </div>

              <div>
                <label htmlFor="buttonLink" className="ios-label">
                  Lien du bouton
                </label>
                <input
                  type="url"
                  id="buttonLink"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="https://exemple.com ou /page"
                />
              </div>
            </div>

            <div className="ios-grid-2">
              <div>
                <label htmlFor="displayOrder" className="ios-label">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                  className="ios-input"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center h-full">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Diapositive active
                  </span>
                </label>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="ios-button-primary flex-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mettre à jour la diapositive
                  </>
                )}
              </button>
              <Link
                href="/dashboard/admin/carousel"
                className="ios-button-secondary flex-1 text-center"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
