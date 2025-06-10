// app/tos/page.js
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const metadata = getSEOTags({
  title: `Conditions Générales d&apos;Utilisation | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

export default function TOS() {
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
                Conditions Générales d&apos;Utilisation
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
                    Bienvenue sur Cyna.fr !
                  </p>
                  
                  <p>
                    Les présentes Conditions Générales d&apos;Utilisation (&quot;Conditions&quot;) s&apos;appliquent à l&apos;utilisation du site https://Cyna.fr (&quot;le Site&quot;) ainsi qu&apos;aux services SaaS proposés par la société Cyna, SAS. En accédant au Site ou en utilisant nos services, vous acceptez les présentes Conditions.
                  </p>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Présentation de Cyna
                    </h2>
                    <div className="ml-9">
                      <p>
                        Cyna est un pure player en cybersécurité pour les PME et MSP. Nous plaçons la qualité de service au cœur de notre activité, en valorisant l&apos;expertise, la proximité et la rapidité d&apos;exécution.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Propriété intellectuelle
                    </h2>
                    <div className="ml-9">
                      <p>
                        L&apos;ensemble des contenus présents sur le Site, y compris les textes, visuels, logos et éléments techniques, sont la propriété exclusive de Cyna ou de ses partenaires. Toute reproduction ou utilisation non autorisée est interdite.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      Données personnelles
                    </h2>
                    <div className="ml-9">
                      <p>
                        Nous collectons les données suivantes : nom, adresse e-mail et informations de paiement. Ces données sont nécessaires à la gestion de nos services. Pour en savoir plus, consultez notre politique de confidentialité : 
                        <Link href="/privacy-policy" className="text-purple-400 hover:text-purple-300 transition-colors ml-1">
                          https://Cyna.fr/privacy-policy
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      Cookies
                    </h2>
                    <div className="ml-9">
                      <p>
                        Nous utilisons des cookies pour améliorer l&apos;expérience utilisateur, mesurer l&apos;audience et optimiser notre service.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">5</span>
                      </div>
                      Droit applicable
                    </h2>
                    <div className="ml-9">
                      <p>
                        Les présentes Conditions sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Modification des Conditions
                    </h2>
                    <div className="ml-9">
                      <p>
                        Cyna peut modifier les présentes Conditions à tout moment. Toute mise à jour vous sera communiquée par e-mail.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">7</span>
                      </div>
                      Contact
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p>
                        Pour toute question concernant ces Conditions, veuillez nous contacter à :
                      </p>
                      <div className="ios-glass-light rounded-xl p-4">
                        <p className="text-white font-semibold">
                          📧 Email : <a href="mailto:supportcyna@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">supportcyna@gmail.com</a>
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-purple-300">
                        Merci d&apos;utiliser Cyna.
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
