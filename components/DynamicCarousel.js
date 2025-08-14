"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

const DynamicCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const fetchSlides = async () => {
    try {
      const cachedSlides = sessionStorage.getItem('carousel-slides');
      const cacheTimestamp = sessionStorage.getItem('carousel-slides-timestamp');
      const now = Date.now();
      
      if (cachedSlides && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 300000) {
        setSlides(JSON.parse(cachedSlides));
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/public/carousel');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
        
        sessionStorage.setItem('carousel-slides', JSON.stringify(data));
        sessionStorage.setItem('carousel-slides-timestamp', now.toString());
      }
    } catch (error) {
      console.error('Error fetching carousel slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative w-full min-h-[120vh] flex flex-col items-center justify-center overflow-hidden ios-hero-section pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950/50"></div>
        <div className="relative z-10 ios-container px-6 md:px-10 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-64 mx-auto mb-4"></div>
            <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-8"></div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-80 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!slides.length) {
    return (
      <section className="relative w-full min-h-[120vh] flex flex-col items-center justify-center overflow-hidden ios-hero-section pb-32">
        {/* Fond animé avec dégradés iOS 16 adaptatif */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950/50"></div>
        
        {/* Effets de lumière flottants */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10 ios-container px-6 md:px-10 text-center ios-fade-in">
          <h1 className="ios-title mb-8 ios-slide-up leading-tight">
            Élevez votre vision<br />
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">
              en réalité digitale
            </span>
          </h1>
          
          <p className="ios-body text-xl md:text-2xl max-w-4xl mx-auto mb-16 ios-slide-up">
            Transformez votre startup rapidement et efficacement avec des outils innovants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 ios-slide-up">
            <Link 
              href="/auth/login" 
              className="hero-btn bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white ios-glow group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Commencer maintenant
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative w-full min-h-[120vh] flex flex-col items-center justify-center overflow-hidden ios-hero-section pb-32">
      {/* Image de fond du slide actuel */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover transition-opacity duration-1000"
          priority={currentSlide === 0}
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
      </div>
      
      {/* Effets de lumière flottants */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 ios-container px-6 md:px-10 text-center ios-fade-in">
        {/* Contenu du slide actuel */}
        <div key={currentSlide} className="ios-slide-up">
          {currentSlideData.subtitle && (
            <div className="inline-flex items-center gap-2 px-6 py-3 ios-glass-light rounded-full mb-8 ios-slide-up group hover:scale-105 transition-all duration-300">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                {currentSlideData.subtitle}
              </span>
            </div>
          )}
          
          <h1 className="ios-title mb-8 text-white leading-tight" style={{animationDelay: '0.2s'}}>
            {currentSlideData.title}
          </h1>
          
          {currentSlideData.description && (
            <p className="ios-body text-xl md:text-2xl max-w-4xl mx-auto mb-16 text-white/90" style={{animationDelay: '0.4s'}}>
              {currentSlideData.description}
            </p>
          )}
          
          {/* Bouton d'action si défini */}
          {currentSlideData.buttonText && currentSlideData.buttonLink && (
            <div className="flex justify-center mb-20 ios-slide-up" style={{animationDelay: '0.6s'}}>
              <Link 
                href={currentSlideData.buttonLink}
                className="hero-btn bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white ios-glow group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {currentSlideData.buttonText}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation du carrousel */}
      {slides.length > 1 && (
        <>
          {/* Boutons précédent/suivant */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full ios-glass-light text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Slide précédent"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full ios-glass-light text-white hover:bg-white/20 transition-all duration-300 group"
            aria-label="Slide suivant"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Indicateurs de slide */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default DynamicCarousel;
