"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import BackgroundEffects from "@/app/components/BackgroundEffects";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // État de la recherche
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filtres avancés
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') || 'all',
    subscriptionDuration: searchParams.get('subscriptionDuration') || 'all',
    exactMatch: searchParams.get('exactMatch') === 'true',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  // Catégories pour le filtre
  const [categories, setCategories] = useState([]);
  const [subscriptionDurations, setSubscriptionDurations] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchSubscriptionDurations();
    if (searchTerm) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const fetchSubscriptionDurations = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const articles = await response.json();
        const durations = [...new Set(articles.map(article => article.subscriptionDuration))].filter(Boolean);
        setSubscriptionDurations(durations.sort());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des durées d\'abonnement:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        q: searchTerm,
        page: currentPage.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        )
      });
      
      const response = await fetch(`/api/articles/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const data = await response.json();
      setResults(data.articles);
      setTotalResults(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
      
      // Mettre à jour l'URL
      const newParams = new URLSearchParams({
        q: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        )
      });
      router.replace(`/search?${newParams}`, { shallow: true });
      
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch();
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: 'all',
      subscriptionDuration: 'all',
      exactMatch: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Plus récents' },
    { value: 'title', label: 'Nom A-Z' },
    { value: 'price', label: 'Prix' },
    { value: 'stock', label: 'Stock' },
    { value: 'category', label: 'Catégorie' },
    { value: 'subscriptionDuration', label: 'Durée d\'abonnement' }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen relative overflow-hidden pt-24 pb-20">
        <BackgroundEffects />
        <div className="ios-container space-y-8 relative z-20">
          
          {/* Header */}
          <div className="text-center ios-fade-in">
            <h1 className="ios-title text-4xl mb-4">
              Recherche <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">avancée</span>
            </h1>
            <p className="ios-body text-lg">
              Trouvez exactement ce que vous cherchez avec nos filtres avancés
            </p>
          </div>

          {/* Formulaire de recherche */}
          <div className="dashboard-card ios-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Barre de recherche principale */}
              <div className="space-y-2">
                <label className="ios-label">Terme de recherche</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ios-input pl-12"
                    placeholder="Rechercher des produits..."
                    required
                  />
                  <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.exactMatch}
                      onChange={(e) => handleFilterChange('exactMatch', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    Correspondance exacte
                  </label>
                  <div className="text-xs">
                    Astuce : utilisez "^" au début pour rechercher "commence par"
                  </div>
                </div>
              </div>

              {/* Filtres avancés */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="ios-label">Catégorie</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="ios-input"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Prix minimum */}
                <div className="space-y-2">
                  <label className="ios-label">Prix minimum</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="ios-input"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Prix maximum */}
                <div className="space-y-2">
                  <label className="ios-label">Prix maximum</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="ios-input"
                    placeholder="999999"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Disponibilité */}
                <div className="space-y-2">
                  <label className="ios-label">Disponibilité</label>
                  <select
                    value={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.value)}
                    className="ios-input"
                  >
                    <option value="all">Tous les produits</option>
                    <option value="true">En stock uniquement</option>
                    <option value="false">Rupture de stock</option>
                  </select>
                </div>

                {/* Durée d'abonnement */}
                <div className="space-y-2">
                  <label className="ios-label">Durée d'abonnement</label>
                  <select
                    value={filters.subscriptionDuration}
                    onChange={(e) => handleFilterChange('subscriptionDuration', e.target.value)}
                    className="ios-input"
                  >
                    <option value="all">Toutes les durées</option>
                    <option value="">Aucune (produit unique)</option>
                    {subscriptionDurations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="ios-label">Trier par</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="ios-input"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="ios-label">Ordre</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="ios-input"
                  >
                    <option value="asc">Croissant</option>
                    <option value="desc">Décroissant</option>
                  </select>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  className="ios-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Rechercher
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ios-button-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>

          {/* Erreur */}
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

          {/* Résultats */}
          {!loading && searchTerm && (
            <div className="space-y-6">
              
              {/* En-tête des résultats */}
              <div className="dashboard-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Résultats de recherche
                    </h2>
                    <p className="ios-body">
                      {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''} 
                      {searchTerm && ` pour "${searchTerm}"`}
                    </p>
                  </div>
                  
                  {totalResults > 0 && (
                    <div className="text-sm text-white/60">
                      Page {currentPage} sur {totalPages}
                    </div>
                  )}
                </div>
              </div>

              {/* Grille des résultats */}
              {results.length > 0 ? (
                <div className="ios-grid-3">
                  {results.map((article) => (
                    <Link key={article.id} href={`/articles/${article.id}`} className="group">
                      <div className="product-card">
                        <div className="product-image-container">
                          {article.image ? (
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                              <span className="text-white text-4xl font-bold">
                                {article.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          {/* Badges */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <span className="px-3 py-1 ios-glass-light text-white text-xs font-medium rounded-full backdrop-blur-md">
                              {article.category}
                            </span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md ${
                              (article.stock || 0) > 0 
                                ? 'bg-green-500/80 text-white' 
                                : 'bg-red-500/80 text-white'
                            }`}>
                              {(article.stock || 0) > 0 ? 'En stock' : 'Épuisé'}
                            </span>
                          </div>
                          
                          {/* Overlay au hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Action button au hover */}
                          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <button className="w-full ios-button-primary justify-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Voir les détails
                            </button>
                          </div>
                        </div>
                        
                        <div className="product-content">
                          <h2 className="product-title">
                            {article.title}
                          </h2>
                          <p className="ios-body text-sm line-clamp-2 mb-4">
                            {article.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="product-price">
                              {article.price?.toFixed(2)} €
                            </div>
                            <div className={`text-xs ${
                              (article.stock || 0) > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {(article.stock || 0) > 0 
                                ? `${article.stock || 0} en stock` 
                                : 'Épuisé'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchTerm && !loading ? (
                <div className="dashboard-card text-center py-12">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun résultat trouvé</h3>
                  <p className="ios-body mb-6">
                    Essayez de modifier vos critères de recherche ou utilisez des termes plus généraux.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="ios-button-secondary"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="dashboard-card text-center py-12">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Commencez votre recherche</h3>
                  <p className="ios-body">
                    Entrez un terme de recherche pour découvrir nos produits.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="dashboard-card">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="ios-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <span className="text-white px-4 py-2">
                      {currentPage} / {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ios-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage;
