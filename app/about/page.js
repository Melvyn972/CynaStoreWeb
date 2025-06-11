// app/about/page.js
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const metadata = getSEOTags({
  title: `À propos | ${config.appName}`,
  canonicalUrlRelative: "/about",
});

export default function AboutPage() {
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
                À propos de {config.appName}
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Protection des données & vie privée</span>
              </div>
            </div>

            {/* Mission */}
            <div className="dashboard-card ios-slide-up mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Notre Mission
                </h2>
              </div>
              
              <div className="ios-body space-y-4 leading-relaxed">
                <p className="text-lg text-center text-purple-700 dark:text-purple-200">
                  Chez <strong className="text-gray-900 dark:text-white">{config.appName}</strong>, la confidentialité et la sécurité de vos données sont au cœur de nos priorités.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="ios-glass-light rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Vérifiez</h3>
                    <p className="text-gray-700 dark:text-white/70 text-sm">Vos préférences de confidentialité dans votre compte</p>
                  </div>
                  
                  <div className="ios-glass-light rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Signalez</h3>
                    <p className="text-gray-700 dark:text-white/70 text-sm">Toute activité suspecte ou fuite potentielle</p>
                  </div>
                  
                  <div className="ios-glass-light rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Consultez</h3>
                    <p className="text-gray-700 dark:text-white/70 text-sm">Notre Politique de Confidentialité et RGPD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Équipe */}
            <div className="dashboard-card ios-slide-up mb-12" style={{animationDelay: '0.1s'}}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Notre Équipe
                </h2>
                <p className="ios-body">
                  Nous sommes trois développeurs passionnés par la technologie et la sécurité
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">M</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Melvyn</h3>
                  <p className="text-purple-600 dark:text-purple-300 font-medium mb-3">Frontend & Design</p>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Spécialisé dans l&apos;expérience utilisateur et les interfaces modernes</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">T</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thomas</h3>
                  <p className="text-cyan-600 dark:text-cyan-300 font-medium mb-3">Backend & Base de données</p>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Expert en architecture serveur et optimisation des performances</p>
                </div>
                
                <div className="ios-glass-light rounded-xl p-6 text-center group hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">N</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nijel</h3>
                  <p className="text-emerald-600 dark:text-emerald-300 font-medium mb-3">Documentation & Support RGPD</p>
                  <p className="text-gray-700 dark:text-white/70 text-sm">Responsable de la conformité et du support technique</p>
                </div>
              </div>
            </div>

            {/* Objectif */}
            <div className="dashboard-card ios-slide-up text-center" style={{animationDelay: '0.2s'}}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  Notre Objectif
                </h2>
              </div>
              
              <p className="ios-body text-lg text-purple-700 dark:text-purple-200 max-w-2xl mx-auto">
                Vous offrir un site <strong className="text-gray-900 dark:text-white">fiable</strong>, <strong className="text-gray-900 dark:text-white">rapide</strong> et <strong className="text-gray-900 dark:text-white">facile à utiliser</strong>, 
                tout en garantissant la plus haute sécurité pour vos données personnelles.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/privacy-policy" className="ios-button-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Politique de confidentialité
                </Link>
                <Link href="/tos" className="ios-button-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Conditions d&apos;utilisation
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-white/50">
                  Dernière mise à jour : 25 avril 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
