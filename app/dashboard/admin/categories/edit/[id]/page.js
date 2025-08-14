'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackgroundEffects from '@/app/components/BackgroundEffects';
import toast from 'react-hot-toast';

export default function EditCategory({ params }) {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0,
    isActive: true
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${params.id}`);
      if (!response.ok) {
        throw new Error('Catégorie non trouvée');
      }
      const data = await response.json();
      setCategory(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        displayOrder: data.displayOrder || 0,
        isActive: data.isActive
      });
      setCurrentImage(data.image);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de la catégorie');
      router.push('/dashboard/admin/categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('displayOrder', formData.displayOrder.toString());
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('currentImageUrl', currentImage || '');
      
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      toast.success('Catégorie mise à jour avec succès !');
      router.push('/dashboard/admin/categories');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour de la catégorie');
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
              Modifier la Catégorie
            </h1>
            <p className="ios-body text-lg mt-2">
              Modifiez les informations de la catégorie
            </p>
          </div>
          <Link
            href="/dashboard/admin/categories"
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
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                placeholder="Entrez le nom de la catégorie"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
                placeholder="Description de la catégorie (optionnel)"
              />
            </div>

            {/* Image actuelle */}
            {currentImage && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Image actuelle
                </label>
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={currentImage}
                    alt="Image actuelle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Nouvelle image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {currentImage ? 'Changer l\'image' : 'Image de la catégorie'}
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Ordre d'affichage */}
            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>

            {/* Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Catégorie active
              </label>
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
                    Mettre à jour la catégorie
                  </>
                )}
              </button>
              <Link
                href="/dashboard/admin/categories"
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
