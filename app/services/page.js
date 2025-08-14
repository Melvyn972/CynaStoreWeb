import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/app/components/BackgroundEffects";
import DynamicContent from "@/components/DynamicContent";
import { Suspense } from "react";

export const metadata = getSEOTags({
  title: `Services | ${config.appName}`,
  canonicalUrlRelative: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        <BackgroundEffects />

        <div className="relative z-20 ios-container py-24 px-6">
          {/* Bouton retour */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Contenu principal */}
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 ios-fade-in">
              <h1 className="ios-title text-4xl md:text-5xl mb-6">
                Nos Services
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Solutions complètes</span>
              </div>
            </div>

            {/* Services Overview */}
            <div className="dashboard-card ios-slide-up mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Nos Solutions
                </h2>
                <p className="ios-body">
                  Découvrez notre gamme complète de services pour accompagner votre transformation digitale
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Développement Web</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Sites web et applications modernes avec les dernières technologies</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analyse & Conseil</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Audit technique et recommandations pour optimiser vos performances</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sécurité & RGPD</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Protection des données et conformité réglementaire garanties</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Optimisation</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Performance, SEO et expérience utilisateur améliorées</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Support Technique</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Accompagnement et maintenance pour tous vos projets</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Solutions Sur-Mesure</h3>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Développement personnalisé selon vos besoins spécifiques</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="dashboard-card ios-slide-up text-center" style={{animationDelay: '0.1s'}}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  Besoin d'un Service ?
                </h2>
              </div>
              
              <p className="ios-body text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Contactez-nous pour discuter de votre projet et découvrir comment nous pouvons vous accompagner dans votre transformation digitale.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="ios-button-primary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Nous contacter
                </Link>
                <Link href="/articles" className="ios-button-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Voir nos produits
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Blocs de contenu dynamiques pour la page Services */}
        <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
          <DynamicContent pageLocation="services" />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
