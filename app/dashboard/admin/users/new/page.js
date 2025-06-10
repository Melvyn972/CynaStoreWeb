'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NewUser() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer les articles disponibles
    async function fetchArticles() {
      try {
        const response = await fetch('/api/admin/articles');
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des articles:", err);
      }
    }
    
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArticleSelection = (articleId) => {
    setSelectedArticles(prev => {
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
    setLoading(true);
    setError('');

    try {
      // Créer un objet FormData pour envoyer le fichier
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      
      // Ajouter les articles sélectionnés
      formDataToSend.append('articles', JSON.stringify(selectedArticles));
      
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création de l\'utilisateur');
      }

      router.push('/dashboard/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="ios-container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl">
              Nouvel Utilisateur
            </h1>
            <p className="ios-body text-lg mt-2">
              Créer un nouveau compte utilisateur
            </p>
          </div>
          <Link 
            href="/dashboard/admin/users" 
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>

        {error && (
          <div className="ios-glass-light rounded-2xl p-6 border border-red-500/30 bg-red-500/10 ios-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <div className="dashboard-card ios-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Informations de base
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3" htmlFor="name">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ios-input w-full"
                  placeholder="Entrez le nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3" htmlFor="email">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ios-input w-full"
                  placeholder="exemple@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="ios-input w-full"
                  placeholder="Mot de passe (optionnel)"
                />
                <p className="text-xs text-white/60 mt-2">
                  Laissez vide pour les utilisateurs s&apos;authentifiant via des fournisseurs OAuth.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3" htmlFor="role">
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="ios-input w-full"
                >
                  <option value="USER">Utilisateur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photo de profil */}
          <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Photo de profil
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    fill
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Choisir une image
                </button>
                <p className="text-xs text-white/60 mt-2">
                  Formats acceptés: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Articles associés */}
          {articles.length > 0 && (
            <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                Articles associés
              </h2>
              
              <div className="ios-grid-3">
                {articles.map(article => (
                  <div 
                    key={article.id}
                    className={`ios-glass-light rounded-xl p-4 cursor-pointer transition-all hover:bg-white/20 ${
                      selectedArticles.includes(article.id) ? 'ring-2 ring-purple-500 bg-purple-500/20' : ''
                    }`}
                    onClick={() => handleArticleSelection(article.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <span className="text-white font-bold">
                            {article.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm line-clamp-1">
                          {article.title}
                        </h3>
                        <p className="text-purple-300 text-xs">
                          {article.price}€
                        </p>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedArticles.includes(article.id) 
                          ? 'border-purple-500 bg-purple-500' 
                          : 'border-white/30'
                      }`}>
                        {selectedArticles.includes(article.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center gap-4 justify-end ios-slide-up" style={{animationDelay: '0.3s'}}>
            <Link
              href="/dashboard/admin/users"
              className="ios-button-secondary"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="ios-button-primary"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Créer l&apos;utilisateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 