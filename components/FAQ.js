"use client";

import { useRef, useState } from "react";

const faqList = [
  {
    question: "Comment CynaStore protège-t-il contre les menaces zero-day?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Notre moteur de détection de menaces alimenté par l&apos;IA analyse en permanence les modèles de comportement sur votre réseau et vos terminaux pour identifier les activités anormales, même provenant de menaces inconnues. Contrairement aux solutions basées sur les signatures, nous ne nous appuyons pas uniquement sur des indicateurs de menaces connus, ce qui nous permet de détecter et de répondre aux attaques zero-day sophistiquées avant qu&apos;elles ne causent des dommages.
      </div>
    ),
  },
  {
    question: "CynaStore est-il conforme aux réglementations de l'industrie?",
    answer: (
      <p>
        Absolument. CynaStore est conçu avec la conformité comme principe fondamental, prenant en charge le RGPD, HIPAA, SOC 2, ISO 27001 et d&apos;autres cadres réglementaires majeurs. Notre plateforme vous aide non seulement à atteindre la conformité, mais maintient également la documentation et les preuves requises pour les audits, réduisant votre charge de conformité jusqu&apos;à 70%.
      </p>
    ),
  },
  {
    question: "Combien de temps faut-il pour implémenter CynaStore?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        La plupart des organisations sont pleinement opérationnelles avec CynaStore en 5 à 7 jours ouvrables. Notre processus d&apos;intégration rationalisé comprend des spécialistes dédiés à la mise en œuvre qui gèrent la configuration technique pendant que votre équipe reçoit une formation complète. Contrairement aux solutions de sécurité traditionnelles qui peuvent prendre des mois à déployer, l&apos;architecture native cloud de CynaStore permet une intégration rapide avec votre infrastructure existante.
      </div>
    ),
  },
  {
    question: "Qu'est-ce qui différencie CynaStore des fournisseurs de sécurité traditionnels?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        CynaStore offre une sécurité de niveau entreprise via un modèle SaaS qui élimine la complexité et les frais généraux des solutions traditionnelles. Nous combinons une technologie avancée avec l&apos;expertise humaine grâce à notre Centre d&apos;Opérations de Sécurité 24/7, fournissant une protection complète sans vous obliger à constituer une équipe de sécurité interne. Notre plateforme évolue continuellement grâce à l&apos;apprentissage par IA, garantissant que vous êtes protégé contre les menaces émergentes.
      </div>
    ),
  },
];

const Item = ({ item, index, isActive, toggleAccordion }) => {
  const accordion = useRef(null);

  return (
    <div className={`border-b border-white/10 ${isActive ? "ios-glass-light" : ""} rounded-md overflow-hidden group hover:bg-white/5 transition-all duration-300`}>
      <button
        className="flex items-start justify-between w-full py-6 px-6 text-left focus:outline-none"
        onClick={() => toggleAccordion(index)}
        aria-expanded={isActive}
      >
        <span className="text-lg md:text-xl font-medium text-white">
          {item?.question}
        </span>
        <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/10 transform transition-transform duration-300 ${isActive ? "rotate-45" : ""} group-hover:bg-white/20`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      
      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-6 pt-0 text-white/80">
          {item?.answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="ios-bg-dark text-white relative overflow-hidden py-24 md:py-32" id="faq">
      {/* Effets de lumière flottants */}
      <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="ios-container px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 ios-fade-in">
            <div className="max-w-lg">
              <span className="ios-badge-primary mb-6">
                Questions Fréquentes
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                Les réponses à vos <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">questions</span>
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Tout ce que vous devez savoir sur notre service de sécurité avancé et comment il peut protéger votre entreprise.
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group">
                <span>Une autre question?</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-7 ios-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="space-y-4 ios-glass rounded-3xl p-2">
              {faqList.map((item, index) => (
                <Item 
                  key={index} 
                  item={item}
                  index={index}
                  isActive={activeIndex === index}
                  toggleAccordion={toggleAccordion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
