"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const features = [
  {
    title: "Détection & Réponse aux Menaces",
    description:
      "Détection avancée des menaces alimentée par l'IA qui identifie les comportements malveillants en temps réel. Notre système de réponse automatisé neutralise les menaces avant qu'elles n'impactent vos opérations.",
    icon: "/icons/shield-check.svg",
  },
  {
    title: "Automatisation de la Conformité",
    description:
      "Restez conforme avec RGPD, HIPAA, SOC 2 et autres cadres réglementaires. Notre plateforme automatise la documentation, les pistes d'audit et les contrôles de sécurité requis pour la certification.",
    icon: "/icons/certificate.svg",
  },
  {
    title: "Centre d'Opérations de Sécurité",
    description:
      "Surveillance 24/7 par des experts en sécurité qui analysent les menaces, valident les alertes et coordonnent la réponse aux incidents. Notre équipe SOC étend vos capacités de sécurité sans les frais d'une équipe interne.",
    icon: "/icons/monitor.svg",
  },
  {
    title: "Gestion des Vulnérabilités",
    description:
      "Analyse continue et priorisation des vulnérabilités basées sur le niveau de risque. Notre plateforme fournit des instructions claires de remédiation et suit le processus de résolution de la détection à l'achèvement.",
    icon: "/icons/search.svg",
  },
];

const Item = ({ feature, isActive, onClick, index }) => {
  const accordion = useRef(null);
  const { title, description } = feature;

  return (
    <div 
      className={`border-b border-gray-200 dark:border-white/10 relative transition-all duration-300 group rounded-2xl overflow-hidden ${isActive ? 'ios-glass-light' : 'hover:bg-white/5 dark:hover:bg-white/5'}`}
    >
      <button
        className="w-full flex items-start justify-between py-6 px-6 text-left focus:outline-none"
        onClick={onClick}
        aria-expanded={isActive}
      >
        <div className="flex items-center gap-4">
          <span className={`text-lg font-semibold transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-white/70'}`}>
            {`0${index + 1}`}
          </span>
          <h3 className={`text-xl md:text-2xl font-medium transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-white/70'}`}>
            {title}
          </h3>
        </div>
        <span className={`transform transition-transform duration-300 ${isActive ? 'rotate-45' : 'rotate-0'} text-gray-600 dark:text-white/80`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <div
        ref={accordion}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-8 pt-2 px-6 pl-16 text-gray-700 dark:text-white/80 leading-relaxed max-w-3xl">
          {description}
        </div>
      </div>
    </div>
  );
};

const FeaturesAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden"
      id="features"
    >
      {/* Effets de lumière flottants */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-purple-400/10 dark:bg-purple-400/10 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="ios-container px-6 md:px-10 relative z-10">
        <div className="max-w-3xl mb-16 md:mb-24 ios-fade-in">
          <span className="ios-badge-primary mb-6">
            Fonctionnalités
          </span>
          <h2 className="ios-title leading-tight mb-8">
            Sécurité de niveau entreprise,
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"> accessible à tous</span>
          </h2>
          <p className="ios-body text-xl">
            Protégez votre entreprise avec des solutions puissantes, intuitives et abordables.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start ios-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="ios-glass rounded-3xl p-2">
              {features.map((feature, index) => (
                <Item
                  key={index}
                  feature={feature}
                  index={index}
                  isActive={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center">
            <div className="w-full aspect-square max-w-md relative overflow-hidden rounded-3xl ios-glass p-1 group hover:scale-105 transition-all duration-300">
              <div className="w-full h-full ios-glass-light rounded-2xl flex items-center justify-center p-12">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <Image
                      src={features[activeIndex].icon || "/icons/shield-check.svg"}
                      alt={features[activeIndex].title}
                      width={150}
                      height={150}
                      className="h-24 w-24 object-contain opacity-90 filter brightness-110 dark:filter dark:brightness-110"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
