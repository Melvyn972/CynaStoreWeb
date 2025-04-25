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
    <div className={`border-b border-base-300 dark:border-gray-800 ${isActive ? "bg-base-200/70 dark:bg-gray-900/30" : ""} rounded-md overflow-hidden`}>
      <button
        className="flex items-start justify-between w-full py-6 px-6 text-left focus:outline-none"
        onClick={() => toggleAccordion(index)}
        aria-expanded={isActive}
      >
        <span className="text-lg md:text-xl font-medium text-base-content dark:text-white">
          {item?.question}
        </span>
        <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-base-300 dark:bg-white/10 transform transition-transform duration-300 ${isActive ? "rotate-45" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      
      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-6 pt-0 text-base-content/80 dark:text-gray-300">
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
    <section className="bg-gradient-to-b from-base-100 to-base-200 dark:bg-black text-base-content dark:text-white relative overflow-hidden py-24 md:py-32" id="faq">
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200/90 dark:from-black dark:via-black dark:to-gray-900 opacity-95 z-0"></div>
      <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-purple-300/10 dark:bg-purple-500/5 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-blue-300/10 dark:bg-blue-500/5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="max-w-lg">
              <span className="inline-block py-1 px-3 text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:bg-white/10 text-base-content dark:text-white rounded-full mb-6 font-medium">
                Questions Fréquentes
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-base-content dark:text-white">
                Les réponses à vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400">questions</span>
              </h2>
              <p className="text-lg text-base-content/80 dark:text-gray-300 mb-8">
                Tout ce que vous devez savoir sur notre service de sécurité avancé et comment il peut protéger votre entreprise.
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 text-primary hover:text-primary-focus dark:text-white dark:hover:text-purple-300 transition-colors">
                <span>Une autre question?</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="space-y-4 border border-base-300 dark:border-transparent rounded-xl p-2 bg-base-100/50 dark:bg-transparent backdrop-blur-sm">
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
