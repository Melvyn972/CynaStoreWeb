"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackgroundEffects from "@/app/components/BackgroundEffects";
import { useHydration } from "@/hooks/useHydration";

const ArticlesClient = ({ articles: initialArticles }) => {
  const isHydrated = useHydration();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("name");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [exactMatch, setExactMatch] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("Toutes");
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    if (isHydrated) {
      fetchCategoriesAndSpecs();
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated && searchParams) {
      const categoryFromUrl = searchParams.get('category');
      if (categoryFromUrl) {
        const decodedCategory = decodeURIComponent(categoryFromUrl);
        if (decodedCategory !== selectedCategory) {
          setSelectedCategory(decodedCategory);
        }
      } else if (selectedCategory !== "Tous") {
        // Si pas de paramètre category dans l'URL, réinitialiser à "Tous"
        setSelectedCategory("Tous");
      }
    }
  }, [isHydrated, searchParams, selectedCategory]);

  const fetchCategoriesAndSpecs = async () => {
    try {
      // Récupérer les spécifications
      const specsResponse = await fetch('/api/specifications');
      if (specsResponse.ok) {
        const specsData = await specsResponse.json();
        setSpecifications(specsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des spécifications:', error);
    }

    // Extraire les catégories des articles existants
    if (initialArticles.length > 0) {
      const cats = [...new Set(initialArticles.map(article => 
        article.categoryObj?.name || article.category
      ).filter(Boolean))];
      setCategories(["Tous", ...cats.sort()]);
    } else {
      setCategories(["Tous"]);
    }
  };

  // Récupérer la fourchette de prix min/max
  const priceExtreme = useMemo(() => {
    if (initialArticles.length === 0) return { min: 0, max: 1000 };
    const prices = initialArticles.map(a => a.price || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [initialArticles]);

  // Récupérer les durées d'abonnement disponibles
  const availableDurations = useMemo(() => {
    const durations = [...new Set(initialArticles.map(article => article.subscriptionDuration))].filter(Boolean);
    return ["Toutes", "Aucune (produit unique)", ...durations.sort()];
  }, [initialArticles]);

  // Mettre à jour la fourchette de prix si nécessaire
  useEffect(() => {
    if (priceRange[0] === 0 && priceRange[1] === 10000) {
      setPriceRange([priceExtreme.min, priceExtreme.max]);
    }
  }, [priceExtreme]);

  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    // Utiliser directement les paramètres URL pour être sûr d'avoir la dernière valeur
    const categoryFromUrl = searchParams?.get('category');
    const currentCategory = categoryFromUrl ? decodeURIComponent(categoryFromUrl) : selectedCategory;
    
    let filtered = initialArticles.filter(article => {
      // Filtre de recherche textuelle
      let matchesSearch = true;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        if (exactMatch) {
          matchesSearch = article.title.toLowerCase() === searchLower ||
                          article.description.toLowerCase() === searchLower ||
                          article.category.toLowerCase() === searchLower ||
                          article.categoryObj?.name.toLowerCase() === searchLower;
        } else {
          matchesSearch = article.title.toLowerCase().includes(searchLower) ||
                          article.description.toLowerCase().includes(searchLower) ||
                          article.category.toLowerCase().includes(searchLower) ||
                          article.categoryObj?.name.toLowerCase().includes(searchLower);
        }
      }
      
      // Filtre par catégorie
      const matchesCategory = currentCategory === "Tous" || 
                              article.categoryObj?.name === currentCategory || 
                              article.category === currentCategory;
      
      // Filtre par prix
      const matchesPrice = (article.price || 0) >= priceRange[0] && (article.price || 0) <= priceRange[1];
      
      // Filtre par stock
      const matchesStock = !inStockOnly || (article.stock || 0) > 0;

      // Filtre par durée d'abonnement
      const matchesDuration = selectedDuration === "Toutes" || 
                              (selectedDuration === "Aucune (produit unique)" && !article.subscriptionDuration) ||
                              article.subscriptionDuration === selectedDuration;

      // Filtre par spécifications (si on a accès aux specs)
      let matchesSpecs = true;
      if (selectedSpecs.length > 0 && article.specifications) {
        // Gérer les deux formats possibles (ancien et nouveau)
        const articleSpecIds = article.specifications.map(spec => 
          spec.technicalSpecificationId || spec.technicalSpecification?.id
        ).filter(Boolean);
        matchesSpecs = selectedSpecs.every(specId => articleSpecIds.includes(specId));
      }
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesDuration && matchesSpecs;
    });



    // Trier les articles
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "availability":
        filtered.sort((a, b) => {
          const aInStock = (a.stock || 0) > 0;
          const bInStock = (b.stock || 0) > 0;
          if (aInStock && !bInStock) return -1;
          if (!aInStock && bInStock) return 1;
          return (b.stock || 0) - (a.stock || 0);
        });
        break;
      case "duration":
        filtered.sort((a, b) => {
          const durationOrder = ["1 mois", "3 mois", "6 mois", "1 an", "2 ans", "3 ans", "Vie"];
          const aIndex = a.subscriptionDuration ? durationOrder.indexOf(a.subscriptionDuration) : -1;
          const bIndex = b.subscriptionDuration ? durationOrder.indexOf(b.subscriptionDuration) : -1;
          
          // Les produits sans abonnement viennent en premier
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return -1;
          if (bIndex === -1) return 1;
          
          return aIndex - bIndex;
        });
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [initialArticles, searchTerm, selectedCategory, priceRange, sortBy, inStockOnly, exactMatch, selectedSpecs, selectedDuration, searchParams]);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    
    if (newCategory === "Tous") {
      router.push('/articles');
    } else {
      const params = new URLSearchParams();
      params.set('category', encodeURIComponent(newCategory));
      router.push(`/articles?${params.toString()}`);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tous");
    setPriceRange([priceExtreme.min, priceExtreme.max]);
    setSortBy("name");
    setInStockOnly(false);
    setExactMatch(false);
    setSelectedSpecs([]);
    setSelectedDuration("Toutes");
    
    router.push('/articles');
  };

  const hasActiveFilters = () => {
    return searchTerm.trim() !== "" || 
           selectedCategory !== "Tous" || 
           priceRange[0] !== priceExtreme.min || 
           priceRange[1] !== priceExtreme.max ||
           inStockOnly ||
           exactMatch ||
           selectedSpecs.length > 0 ||
           selectedDuration !== "Toutes";
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundEffects />
        <div className="ios-container pt-24 pb-20 relative z-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="ios-container pt-24 pb-20 relative z-20">
        {/* Header */}
        <div className="text-center ios-fade-in mb-8">
          <h1 className="ios-title text-4xl mb-4">
            {selectedCategory !== "Tous" ? (
              <>
                Catégorie : <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">{selectedCategory}</span>
              </>
            ) : (
              <>
                Notre <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">Boutique</span>
              </>
            )}
          </h1>
          <p className="ios-body text-lg">
            {selectedCategory !== "Tous" 
              ? `Explorez tous les produits de la catégorie ${selectedCategory}.`
              : "Découvrez notre sélection de produits premium, soigneusement choisis pour vous offrir la meilleure expérience."
            }
          </p>
          {selectedCategory !== "Tous" && (
            <div className="mt-4">
              <button
                onClick={() => handleCategoryChange("Tous")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Voir toutes les catégories
              </button>
            </div>
          )}
        </div>

        {/* Layout avec sidebar et contenu */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar des filtres */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="dashboard-card sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Filtres
              </h2>
              
              <div className="space-y-6">
                {/* Recherche */}
                <div className="space-y-2">
                  <label className="ios-label">Recherche</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="ios-input pl-10"
                      placeholder="Rechercher..."
                    />
                    <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="ios-label">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="ios-input"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Durée d'abonnement */}
                <div className="space-y-2">
                  <label className="ios-label">Durée d'abonnement</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="ios-input"
                  >
                    {availableDurations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                {/* Prix */}
                <div className="space-y-3">
                  <label className="ios-label">Prix (€)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="ios-input text-sm"
                      placeholder="Min"
                      min={priceExtreme.min}
                      max={priceExtreme.max}
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || priceExtreme.max])}
                      className="ios-input text-sm"
                      placeholder="Max"
                      min={priceExtreme.min}
                      max={priceExtreme.max}
                    />
                  </div>
                  <div className="text-xs text-white/60">
                    {priceExtreme.min}€ - {priceExtreme.max}€
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="ios-label">Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/80 text-sm">En stock uniquement</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exactMatch}
                        onChange={(e) => setExactMatch(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/80 text-sm">Correspondance exacte</span>
                    </label>
                  </div>
                </div>

                {/* Spécifications techniques */}
                {specifications.length > 0 && (
                  <div className="space-y-3">
                    <label className="ios-label">Spécifications techniques</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {specifications.map((spec) => (
                        <label key={spec.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedSpecs.includes(spec.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSpecs(prev => [...prev, spec.id]);
                              } else {
                                setSelectedSpecs(prev => prev.filter(id => id !== spec.id));
                              }
                            }}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-white/80 text-sm">{spec.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset */}
                {hasActiveFilters() && (
                  <button
                    onClick={resetFilters}
                    className="w-full ios-button-destructive text-sm"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre de tri et résultats */}
            <div className="dashboard-card mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-white/60">
                  {filteredArticles.length} produit{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">Trier par :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="ios-input text-sm py-1 px-2 min-w-0"
                  >
                    <option value="name">Nom A-Z</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                    <option value="availability">Disponibilité</option>
                    <option value="duration">Durée d'abonnement</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.id}`} className="group">
                    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] border border-white/10">
                      {/* Image container */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={article.image || "/api/placeholder/400/300"}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        
                        {/* Badges en overlay */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <span className="px-3 py-1 bg-gray-900/80 backdrop-blur text-white text-xs font-medium rounded-full">
                              {article.categoryObj?.name || article.category}
                            </span>
                            {article.subscriptionDuration && (
                              <span className="px-3 py-1 bg-cyan-500/90 backdrop-blur text-white text-xs font-medium rounded-full">
                                {article.subscriptionDuration}
                              </span>
                            )}
                          </div>
                          
                          <span className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur ${
                            (article.stock || 0) > 0 
                              ? 'bg-green-500/90 text-white' 
                              : 'bg-red-500/90 text-white'
                          }`}>
                            {(article.stock || 0) > 0 ? 'En stock' : 'Épuisé'}
                          </span>
                        </div>
                        
                        {/* Overlay sombre au hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                      </div>
                      
                      {/* Contenu de la carte */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {article.description}
                        </p>
                        
                        {/* Informations du produit */}
                        <div className="space-y-3">
                          {/* Stock info */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Disponibilité</span>
                            <span className={`font-medium ${
                              (article.stock || 0) > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {(article.stock || 0) > 0 
                                ? `${article.stock || 0} en stock` 
                                : 'Épuisé'
                              }
                            </span>
                          </div>
                          
                          {/* Durée si présente */}
                          {article.subscriptionDuration && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/60">Durée</span>
                              <span className="text-cyan-400 font-medium">{article.subscriptionDuration}</span>
                            </div>
                          )}
                          
                          {/* Prix et action */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="text-2xl font-bold text-white">
                              {article.price?.toFixed(2)} €
                            </div>
                            
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg">
                              Voir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dashboard-card text-center py-12">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
                <p className="ios-body mb-6">
                  Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                </p>
                <button
                  onClick={resetFilters}
                  className="ios-button-secondary"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesClient;