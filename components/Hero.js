"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const scrollToNextSection = (e) => {
    // Feedback visuel du clic
    e.target.closest('button').style.transform = 'scale(0.95)';
    setTimeout(() => {
      e.target.closest('button').style.transform = '';
    }, 150);

    // Option 1: Chercher la section Problem spécifiquement
    const problemSection = document.querySelector('#problem');
    if (problemSection) {
      problemSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }

    // Option 2: Défiler d'une hauteur d'écran vers le bas
    const viewportHeight = window.innerHeight;
    window.scrollTo({
      top: viewportHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative w-full min-h-[120vh] flex flex-col items-center justify-center overflow-hidden ios-hero-section pb-32">
      {/* Fond animé avec dégradés iOS 16 adaptatif */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950/50"></div>
      
      {/* Effets de lumière flottants */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-400/10 dark:bg-purple-400/10 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Points de lumière */}
      <div className="absolute inset-0 opacity-30 z-10">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-500 dark:bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-indigo-500 dark:bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/6 left-1/5 w-1.5 h-1.5 bg-purple-400 dark:bg-purple-200 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/5 right-1/5 w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-200 rounded-full animate-pulse" style={{animationDelay: '5s'}}></div>
      </div>
      
      <div className="relative z-10 ios-container px-6 md:px-10 text-center ios-fade-in">
        {/* Badge de nouveauté */}
        <div className="inline-flex items-center gap-2 px-6 py-3 ios-glass-light rounded-full mb-12 ios-slide-up group hover:scale-105 transition-all duration-300">
          <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white/90 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            ✨ Découvrez une nouvelle façon de créer
          </span>
        </div>
        
        {/* Titre principal */}
        <h1 className="ios-title mb-8 ios-slide-up leading-tight" style={{animationDelay: '0.2s'}}>
          Élevez votre vision<br />
          <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">
            en réalité digitale
          </span>
        </h1>
        
        {/* Sous-titre */}
        <p className="ios-body text-xl md:text-2xl max-w-4xl mx-auto mb-16 ios-slide-up" style={{animationDelay: '0.4s'}}>
          Transformez votre startup rapidement et efficacement avec des outils innovants, 
          des solutions modernes et une expérience utilisateur exceptionnelle.
        </p>
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 ios-slide-up" style={{animationDelay: '0.6s'}}>
          <Link 
            href="/auth/login" 
            className="hero-btn bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white ios-glow group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Commencer maintenant
            </span>
          </Link>
          
          <Link 
            href="#features" 
            className="hero-btn ios-glass-light text-gray-900 dark:text-white/90 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 group"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Découvrir
            </span>
          </Link>
        </div>

        {/* Statistiques */}
        <div className="flex flex-wrap justify-center gap-8 mb-20 ios-slide-up" style={{animationDelay: '0.8s'}}>
          <div className="ios-glass rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              10k+
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60 uppercase tracking-wide font-medium">
              Utilisateurs actifs
            </div>
          </div>
          
          <div className="ios-glass rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60 uppercase tracking-wide font-medium">
              Temps de fonctionnement
            </div>
          </div>
          
          <div className="ios-glass rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-white/60 uppercase tracking-wide font-medium">
              Support technique
            </div>
          </div>
        </div>

        {/* Image du produit */}
        <div className="relative max-w-6xl mx-auto ios-slide-up" style={{animationDelay: '1s'}}>
          <div className="relative overflow-hidden rounded-3xl ios-card group">
            <Image
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              alt="Interface moderne de l'application"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              priority={true}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px"
              quality={90}
            />
            
            {/* Overlay avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent group-hover:from-purple-900/60 transition-all duration-700"></div>
            
            {/* Effets de lueur */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
          </div>
          
          {/* Éléments flottants autour de l'image */}
          <div className="absolute -top-6 -left-6 w-12 h-12 ios-glass rounded-2xl flex items-center justify-center ios-float group hover:scale-110 transition-transform duration-300 z-30">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="absolute -top-6 -right-6 w-12 h-12 ios-glass rounded-2xl flex items-center justify-center ios-float group hover:scale-110 transition-transform duration-300 z-30" style={{animationDelay: '1s'}}>
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="absolute -bottom-6 -left-6 w-12 h-12 ios-glass rounded-2xl flex items-center justify-center ios-float group hover:scale-110 transition-transform duration-300 z-30" style={{animationDelay: '2s'}}>
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          
          <div className="absolute -bottom-6 -right-6 w-12 h-12 ios-glass rounded-2xl flex items-center justify-center ios-float group hover:scale-110 transition-transform duration-300 z-30" style={{animationDelay: '3s'}}>
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 ios-fade-in z-20" style={{animationDelay: '1.5s'}}>
        <button 
          onClick={scrollToNextSection}
          className="flex flex-col items-center gap-3 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/80 transition-all duration-300 cursor-pointer group bg-transparent border-none active:scale-95"
          aria-label="Défiler vers la section suivante"
        >
          <span className="text-sm font-medium group-hover:font-semibold transition-all">
            👇 Défiler vers le bas
          </span>
          <div className="p-4 rounded-full ios-glass-light group-hover:bg-white/30 group-hover:scale-110 group-active:scale-95 transition-all duration-300 shadow-lg">
            <svg className="w-6 h-6 animate-bounce group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;
