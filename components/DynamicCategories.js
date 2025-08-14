"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

const DynamicCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="ios-container">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="ios-container">
        <div className="text-center mb-16 ios-fade-in">
          <h2 className="ios-title mb-6">
            Découvrez nos <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">catégories</span>
          </h2>
          <p className="ios-body text-lg max-w-2xl mx-auto">
            Explorez notre large gamme de produits et services organisés par catégories pour trouver exactement ce que vous cherchez.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              href={`/articles?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <div 
                className="ios-card p-6 text-center group-hover:scale-105 transition-all duration-300 ios-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image de la catégorie */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay avec dégradé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                  
                  {/* Badge nombre d'articles */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {category._count.articles} article{category._count.articles > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Informations de la catégorie */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="ios-body text-sm line-clamp-3 mb-4">
                      {category.description}
                    </p>
                  )}

                  {/* Bouton d'action */}
                  <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    <span className="text-sm font-medium">Explorer</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bouton voir toutes les catégories */}
        <div className="text-center mt-16 ios-fade-in">
          <Link 
            href="/articles" 
            className="ios-button-primary inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Voir tous les produits
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DynamicCategories;
