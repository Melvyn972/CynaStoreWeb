'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditUser({ params }) {
  const router = useRouter();
  const { id } = params;
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    imageUrl: ''
  });
  const [articles, setArticles] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Récupérer les données de l'utilisateur
        const userResponse = await fetch(`/api/admin/users/${id}`);
        
        if (!userResponse.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        
        const userData = await userResponse.json();
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          role: userData.role,
          imageUrl: userData.image || ''
        });
        
        if (userData.image) {
          setImagePreview(userData.image);
        }
        
        // Récupérer les achats de l'utilisateur
        const purchasesResponse = await fetch(`/api/admin/users/${id}/purchases`);
        if (purchasesResponse.ok) {
          const purchasesData = await purchasesResponse.json();
          setUserPurchases(purchasesData.map(p => p.articleId));
        }
        
        // Récupérer tous les articles
        const articlesResponse = await fetch('/api/admin/articles');
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setArticles(articlesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArticleSelection = (articleId) => {
    setUserPurchases(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      formDataToSend.append('role', formData.role);
      formDataToSend.append('articles', JSON.stringify(userPurchases));
      formDataToSend.append('currentImageUrl', formData.imageUrl);
      
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour de l\'utilisateur');
      }

      router.push('/dashboard/admin/users');
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
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
              href="/dashboard/admin/users"
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux utilisateurs
            </Link>
            <div className="w-px h-8 bg-white/20"></div>
            <h1 className="ios-title text-2xl md:text-3xl">
              Modifier l&apos;utilisateur
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
          {/* Section informations de base */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Informations utilisateur
            </h2>

            <div className="ios-grid-2 mb-8">
              <div className="space-y-2">
                <label className="ios-label">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="Nom complet de l&apos;utilisateur"
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="adresse@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="Laisser vide pour conserver l&apos;actuel"
                />
              </div>

              <div className="space-y-2">
                <label className="ios-label">
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="ios-input"
                >
                  <option value="USER">Membre</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            {/* Section photo de profil */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Photo de profil
              </h3>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ios-glass-light">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      fill
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

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
                    className="ios-button-secondary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Changer l&apos;image
                  </button>
                  <p className="ios-body text-xs">
                    PNG, JPG ou GIF. Maximum 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section achats/articles */}
          {articles.length > 0 && (
            <div className="dashboard-card">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                Articles achetés ({userPurchases.length})
              </h2>

              <div className="ios-grid-3">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className={`product-card cursor-pointer transition-all ${
                      userPurchases.includes(article.id)
                        ? 'ring-2 ring-emerald-500 bg-emerald-500/10'
                        : 'hover:ring-2 hover:ring-white/30'
                    }`}
                    onClick={() => handleArticleSelection(article.id)}
                  >
                    <div className="product-image">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {article.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {userPurchases.includes(article.id) && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-content">
                      <h3 className="product-title text-sm">
                        {article.title}
                      </h3>
                      <div className="product-price text-sm">
                        {article.price?.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/admin/users"
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