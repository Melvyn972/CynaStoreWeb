"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";

const ProductImageCarousel = ({ title, mainImage, imagesJson }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Préparer la liste des images
    let imagesList = [];
    
    // Ajouter l'image principale si elle existe
    if (mainImage) {
      imagesList.push(mainImage);
    }
    
    // Ajouter les images supplémentaires depuis le JSON
    if (imagesJson) {
      try {
        const additionalImages = JSON.parse(imagesJson);
        if (Array.isArray(additionalImages)) {
          // Les images peuvent être des objets {url, alt} ou des strings
          additionalImages.forEach(img => {
            const imageUrl = typeof img === 'object' ? img.url : img;
            // Filtrer les images qui ne sont pas déjà l'image principale
            if (imageUrl && imageUrl !== mainImage) {
              imagesList.push(imageUrl);
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du parsing des images JSON:', error);
      }
    }
    
    // Si aucune image, utiliser une image par défaut
    if (imagesList.length === 0) {
      imagesList = [null]; // null pour déclencher l'affichage du placeholder
    }
    
    setImages(imagesList);
  }, [mainImage, imagesJson]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="dashboard-card">
      {/* Image principale */}
      <div className="aspect-square relative rounded-2xl overflow-hidden mb-4">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-8xl font-bold">{title?.charAt(0) || '?'}</span>
          </div>
        )}
        
        {/* Navigation du carrousel */}
        {images.length > 1 && (
          <>
            {/* Boutons précédent/suivant */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full ios-glass-light text-white hover:bg-white/20 transition-all duration-300 group"
              aria-label="Image précédente"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full ios-glass-light text-white hover:bg-white/20 transition-all duration-300 group"
              aria-label="Image suivante"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Indicateur d'image actuelle */}
            <div className="absolute top-4 left-4 px-3 py-1 ios-glass-light text-white text-sm font-medium rounded-full backdrop-blur-md">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Miniatures */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`aspect-square relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'border-purple-500 scale-105' 
                  : 'border-transparent hover:border-purple-300 hover:scale-102'
              }`}
            >
              {image ? (
                <Image
                  src={image}
                  alt={`${title} - Miniature ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">{title?.charAt(0) || '?'}</span>
                </div>
              )}
              
              {/* Overlay de sélection */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentImageIndex 
                  ? 'bg-purple-500/20 opacity-100' 
                  : 'bg-black/20 opacity-0 hover:opacity-100'
              }`}></div>
            </button>
          ))}
        </div>
      )}
      
      {/* Informations supplémentaires */}
      <div className="mt-4 p-4 ios-glass-light rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Images disponibles</span>
          <span className="text-white font-medium">{images.length}</span>
        </div>
        {images.length > 1 && (
          <div className="mt-2 text-xs text-white/60">
            Cliquez sur les miniatures pour naviguer
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
