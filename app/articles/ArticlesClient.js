"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const ArticlesClient = ({ articles: initialArticles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("name");

  // Récupérer toutes les catégories uniques
  const categories = useMemo(() => {
    const cats = [...new Set(initialArticles.map(article => article.category))];
    return ["Tous", ...cats];
  }, [initialArticles]);

  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    let filtered = initialArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory;
      const matchesPrice = article.price >= priceRange[0] && article.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Trier les articles
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [initialArticles, searchTerm, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-20">
      <div className="ios-container px-6 md:px-10 mx-auto">
        {/* Header de la boutique */}
        <div className="text-center mb-16 ios-fade-in">
          <h1 className="ios-title mb-6">
            Notre <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Boutique</span>
          </h1>
          <p className="ios-body text-xl max-w-3xl mx-auto">
            Découvrez notre sélection de produits innovants, conçus pour transformer votre expérience digitale
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar avec filtres */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="filter-container ios-slide-up">
              <h2 className="filter-title">Filtres</h2>
              
              {/* Recherche */}
              <div className="filter-group">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nom du produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ios-input pr-10"
                  />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Catégories */}
              <div className="filter-group">
                <h3 className="text-sm font-medium text-white/80 mb-3">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`filter-item w-full text-left p-3 rounded-xl transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedCategory === category ? 'bg-purple-400' : 'bg-white/30'
                        }`}></div>
                        {category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fourchette de prix */}
              <div className="filter-group">
                <h3 className="text-sm font-medium text-white/80 mb-3">Prix</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(priceRange[1] / 1000) * 100}%, #374151 ${(priceRange[1] / 1000) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-white/60">
                    <span>0 €</span>
                    <span>{priceRange[1]} €</span>
                  </div>
                </div>
              </div>

              {/* Tri */}
              <div className="filter-group">
                <h3 className="text-sm font-medium text-white/80 mb-3">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ios-input appearance-none cursor-pointer bg-gray-950/50"
                >
                  <option value="name">Nom A-Z</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Tous");
                  setPriceRange([0, 1000]);
                  setSortBy("name");
                }}
                className="w-full ios-button-secondary justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Grille de produits */}
          <div className="flex-1">
            {/* Header de résultats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="ios-slide-up">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {filteredArticles.length} produit{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                </h3>
                {searchTerm && (
                  <p className="text-white/60">
                    Résultats pour &quot;{searchTerm}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Grille de produits */}
            {filteredArticles.length > 0 ? (
              <div className="ios-grid-3 ios-slide-up" style={{animationDelay: '0.2s'}}>
                {filteredArticles.map((article, index) => (
                  <Link href={`/articles/${article.id}`} key={article.id}>
                    <div className="product-card group ios-fade-in" style={{animationDelay: `${0.1 * index}s`}}>
                      <div className="product-image">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {article.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        {/* Badge catégorie */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 ios-glass-light text-white text-xs font-medium rounded-full backdrop-blur-md">
                            {article.category}
                          </span>
                        </div>
                        
                        {/* Overlay au hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Action button au hover */}
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="w-full ios-button-primary justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
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
                            {article.price.toFixed(2)} €
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-white/60">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Message si aucun résultat */
              <div className="text-center py-20 ios-fade-in">
                <div className="ios-glass-light rounded-3xl p-12 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-purple-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Aucun produit trouvé
                  </h3>
                  <p className="ios-body">
                    Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("Tous");
                      setPriceRange([0, 1000]);
                      setSortBy("name");
                    }}
                    className="mt-6 ios-button-primary"
                  >
                    Voir tous les produits
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesClient; 