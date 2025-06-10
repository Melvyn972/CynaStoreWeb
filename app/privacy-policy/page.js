// app/privacy-policy/page.js
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const metadata = getSEOTags({
  title: `Politique de Confidentialité | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

export default function PrivacyPolicy() {
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
            <div className="text-center mb-12 ios-fade-in">
              <h1 className="ios-title text-4xl md:text-5xl mb-6">
                Politique de Confidentialité
              </h1>
              <p className="ios-body text-lg">
                Dernière mise à jour : 24 avril 2025
              </p>
            </div>

            {/* Contenu */}
            <div className="dashboard-card ios-slide-up">
              <div className="prose prose-invert prose-purple max-w-none">
                <div className="ios-body space-y-6 leading-relaxed">
                  <p>
                    Merci de visiter Cyna (&quot;nous&quot;, &quot;notre&quot; ou &quot;nos&quot;). Cette Politique de Confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles et non personnelles lorsque vous utilisez notre site web accessible à l&apos;adresse https://Cyna.fr (&quot;le Site&quot;).
                  </p>
                  
                  <p>
                    En accédant ou en utilisant le Site, vous acceptez les termes de cette Politique de Confidentialité.
                  </p>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Données collectées
                    </h2>
                    
                    <div className="space-y-4 ml-9">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-2">1.1 Données personnelles</h3>
                        <p>Nous collectons les informations suivantes :</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-white/80">
                          <li><strong>Nom :</strong> pour personnaliser votre expérience et faciliter la communication.</li>
                          <li><strong>Adresse e-mail :</strong> pour vous envoyer des informations liées à vos commandes, notifications importantes, et communications.</li>
                          <li><strong>Informations de paiement :</strong> pour traiter vos commandes de manière sécurisée. Ces données ne sont pas stockées sur nos serveurs et sont traitées via un prestataire de paiement sécurisé.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-2">1.2 Données non personnelles</h3>
                        <p>
                          Nous utilisons des cookies pour collecter des informations non personnelles telles que l&apos;adresse IP, le type de navigateur, les informations sur l&apos;appareil, et les habitudes de navigation. Cela nous aide à améliorer votre expérience, analyser les tendances et optimiser nos services.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Finalité de la collecte
                    </h2>
                    <div className="ml-9">
                      <p>
                        Les données collectées sont utilisées exclusivement pour le traitement des commandes, l&apos;envoi de confirmations, le support client et le suivi des statuts de commande.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      Partage des données
                    </h2>
                    <div className="ml-9">
                      <p>
                        Nous ne partageons vos données personnelles avec aucun tiers, sauf si cela est strictement nécessaire au traitement de votre commande (ex. : prestataire de paiement). Nous ne vendons, n&apos;échangeons ou ne louons vos données à aucun tiers.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      Protection des enfants
                    </h2>
                    <div className="ml-9">
                      <p>
                        Cyna ne s&apos;adresse pas aux enfants de moins de 13 ans. Nous ne collectons pas sciemment de données personnelles auprès d&apos;enfants. Si vous êtes un parent ou tuteur et que vous pensez que votre enfant nous a transmis des données personnelles, contactez-nous à l&apos;adresse indiquée ci-dessous.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">5</span>
                      </div>
                      Modifications de la politique
                    </h2>
                    <div className="ml-9">
                      <p>
                        Cette Politique de Confidentialité peut être modifiée à tout moment. En cas de changement significatif, nous vous en informerons par e-mail. Les mises à jour seront également disponibles sur cette page.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Contact
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p>
                        Pour toute question ou demande concernant cette Politique de Confidentialité, vous pouvez nous contacter à l&apos;adresse suivante :
                      </p>
                      <div className="ios-glass-light rounded-xl p-4">
                        <p className="text-white font-semibold">
                          📧 Email : <a href="mailto:supportcyna@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">supportcyna@gmail.com</a>
                        </p>
                      </div>
                      <p className="text-sm text-white/60">
                        En utilisant Cyna, vous acceptez les termes de cette Politique de Confidentialité.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
