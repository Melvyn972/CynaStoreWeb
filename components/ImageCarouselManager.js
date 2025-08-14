'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

const ImageCarouselManager = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const fileInputRef = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = ''; // Reset input
  };

  const processFiles = (files) => {
    if (images.length + files.length > maxImages) {
      alert(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            alt: file.name
          };
          onImagesChange(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    onImagesChange(prev => prev.filter(img => img.id !== imageId));
  };

  const updateImageAlt = (imageId, alt) => {
    onImagesChange(prev => 
      prev.map(img => img.id === imageId ? { ...img, alt } : img)
    );
  };

  // Drag and drop functionality
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="space-y-2">
        <label className="ios-label">
          Images du produit ({images.length}/{maxImages})
        </label>
        
        <div 
          className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            processFiles(files);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-white/60 mb-2">
            Cliquez ou glissez-déposez vos images ici
          </p>
          <p className="text-sm text-white/40">
            PNG, JPG, GIF jusqu'à 10MB • Maximum {maxImages} images
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Images sélectionnées</h4>
            <p className="text-xs text-white/60">Glissez pour réorganiser</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group bg-gray-800 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-move ${
                  dragOverIndex === index ? 'border-purple-400 scale-105' : 'border-transparent'
                } ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-video relative">
                  <Image
                    src={image.preview}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Main indicator */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                        Image principale
                      </span>
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Drag handle */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 bg-black/50 rounded text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Alt text input */}
                <div className="p-3">
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => updateImageAlt(image.id, e.target.value)}
                    placeholder="Description de l'image (alt text)"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-purple-300 font-medium mb-1">Conseils :</p>
                <ul className="text-purple-200 space-y-1 text-xs">
                  <li>• La première image sera l'image principale du produit</li>
                  <li>• Glissez-déposez pour réorganiser les images</li>
                  <li>• Ajoutez une description pour chaque image (SEO)</li>
                  <li>• Utilisez des images de bonne qualité (minimum 800x600px)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarouselManager;
