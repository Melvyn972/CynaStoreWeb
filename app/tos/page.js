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
                Dernière mise à jour : 11 juin 2025
              </p>
            </div>

            {/* Contenu */}
            <div className="dashboard-card ios-slide-up">
              <div className="prose prose-gray dark:prose-invert prose-purple max-w-none">
                <div className="ios-body space-y-6 leading-relaxed">
                  {/* Entité juridique */}
                  <div className="ios-glass-light rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Éditeurs et responsables</h3>
                    <p className="text-gray-700 dark:text-white/80 mb-4">
                      La plateforme Cyna est éditée et exploitée conjointement par trois personnes physiques agissant en copropriété :
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <p className="font-semibold text-purple-600 dark:text-purple-300">Melvyn Thierry-Bellefond</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">Frontend & Design</p>
                        <p className="text-xs text-gray-500 dark:text-white/60">Responsable technique</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <p className="font-semibold text-purple-600 dark:text-purple-300">Thomas Lindeker</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">Backend & Base de données</p>
                        <p className="text-xs text-gray-500 dark:text-white/60">Responsable infrastructure</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <p className="font-semibold text-purple-600 dark:text-purple-300">Nijel Sarmiento</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">Documentation & Support RGPD</p>
                        <p className="text-xs text-gray-500 dark:text-white/60">Délégué à la protection des données</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-white/80">
                    Les présentes Conditions Générales d&apos;Utilisation (&quot;CGU&quot;) définissent les modalités d&apos;accès et d&apos;utilisation de la plateforme de cybersécurité Cyna accessible à l&apos;adresse https://cyna.fr (&quot;la Plateforme&quot;) ainsi que des services de cybersécurité associés (&quot;les Services&quot;).
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      <strong>⚖️ Acceptation :</strong> L&apos;accès et l&apos;utilisation de la Plateforme impliquent l&apos;acceptation pleine et entière des présentes CGU. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                    </p>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Objet et présentation des services
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p className="text-gray-700 dark:text-white/80">
                        Cyna est une plateforme de cybersécurité spécialisée pour les PME (Petites et Moyennes Entreprises) et MSP (Managed Service Providers). Nous proposons une approche intégrée de la sécurité informatique combinant expertise technique, outils automatisés et accompagnement personnalisé.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🛡️ Services de cybersécurité</h4>
                          <ul className="text-sm text-gray-600 dark:text-white/70 space-y-1">
                            <li>• Audits de sécurité automatisés</li>
                            <li>• Surveillance continue des menaces</li>
                            <li>• Détection et réponse aux incidents</li>
                            <li>• Mise en conformité réglementaire</li>
                            <li>• Formation et sensibilisation</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💎 Notre engagement qualité</h4>
                          <ul className="text-sm text-gray-600 dark:text-white/70 space-y-1">
                            <li>• Expertise technique certifiée</li>
                            <li>• Proximité et réactivité</li>
                            <li>• Solutions sur mesure</li>
                            <li>• Support client premium</li>
                            <li>• Innovation continue</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <p className="text-purple-800 dark:text-purple-200 text-sm">
                          <strong>🎯 Mission :</strong> Démocratiser l&apos;accès à une cybersécurité de niveau entreprise pour les PME et faciliter le travail des MSP avec des outils professionnels et intuitifs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Conditions d&apos;accès et d&apos;inscription
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">🏢 Services B2B exclusivement</h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          Nos services s&apos;adressent exclusivement aux entreprises, professionnels indépendants et MSP. L&apos;inscription par des particuliers à titre personnel est interdite.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Conditions requises pour l&apos;inscription :</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-white/70">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Être majeur (18 ans minimum) et avoir la capacité juridique</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Disposer d&apos;une adresse email professionnelle valide</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Agir pour le compte d&apos;une entreprise ou d&apos;une organisation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Fournir des informations exactes et à jour</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Accepter les présentes CGU et la Politique de confidentialité</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          <strong>⚠️ Responsabilité :</strong> Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout accès à votre compte est présumé effectué par vous-même.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      Propriété intellectuelle et droits d&apos;auteur
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">© Droits des copropriétaires</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                          La plateforme Cyna, son code source, son design et tous ses éléments sont protégés par le droit d&apos;auteur et sont la propriété conjointe de :
                        </p>
                        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                          <li>• Melvyn Thierry-Bellefond (développement frontend et design)</li>
                          <li>• Thomas Lindeker (développement backend et infrastructure)</li>
                          <li>• Nijel Sarmiento (documentation et processus)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Éléments protégés :</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2 text-sm text-gray-600 dark:text-white/70">
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">⊗</span>
                              <span>Code source et algorithmes</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">⊗</span>
                              <span>Interface utilisateur et design</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">⊗</span>
                              <span>Logos, marques et identité visuelle</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-white/70">
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">⊗</span>
                              <span>Documentation technique</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">⊗</span>
                              <span>Méthodologies et processus</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">⊗</span>
                              <span>Bases de données et contenus</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🚫 Utilisations interdites</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Toute reproduction, distribution, modification, transmission, republication, exploitation commerciale ou création d&apos;œuvres dérivées sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon passible de sanctions pénales.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      Utilisation des services et obligations de l&apos;utilisateur
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Utilisation autorisée</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• Utilisation conforme aux finalités de cybersécurité</li>
                          <li>• Respect des conditions techniques d&apos;utilisation</li>
                          <li>• Utilisation dans le cadre professionnel uniquement</li>
                          <li>• Respect de la confidentialité des données tierces</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🚫 Utilisations interdites</h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          <li>• Tentatives de piratage ou d&apos;intrusion</li>
                          <li>• Diffusion de malwares ou contenus malveillants</li>
                          <li>• Utilisation pour des activités illégales</li>
                          <li>• Partage d&apos;accès avec des tiers non autorisés</li>
                          <li>• Surcharge intentionnelle de l&apos;infrastructure</li>
                          <li>• Rétro-ingénierie ou tentatives de contournement</li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          <strong>⚠️ Sanctions :</strong> Toute violation de ces conditions peut entraîner la suspension immédiate de votre accès et des poursuites judiciaires.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">5</span>
                      </div>
                      Protection des données et vie privée
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p className="text-gray-700 dark:text-white/80">
                        Le traitement de vos données personnelles est essentiel au fonctionnement de nos services de cybersécurité. Nous collectons et traitons vos données dans le strict respect du RGPD et des dernières directives CNIL 2024.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📊 Données collectées</h4>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Informations d&apos;identification professionnelle</li>
                            <li>• Données de connexion et d&apos;utilisation</li>
                            <li>• Métadonnées de sécurité (anonymisées)</li>
                            <li>• Préférences et paramètres utilisateur</li>
                          </ul>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                          <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🛡️ Vos droits</h4>
                          <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                            <li>• Accès et rectification de vos données</li>
                            <li>• Effacement et portabilité</li>
                            <li>• Opposition et limitation du traitement</li>
                            <li>• Gestion des consentements</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                        <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                          <strong>📋 Documentation complète :</strong> Consultez notre 
                          <Link href="/privacy-policy" className="font-semibold hover:underline ml-1">
                            Politique de confidentialité
                          </Link>
                          pour plus de détails sur le traitement de vos données, vos droits et nos mesures de sécurité.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Cookies et technologies de suivi
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p className="text-gray-700 dark:text-white/80">
                        Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, assurer la sécurité de la plateforme et analyser son utilisation dans le respect des directives CNIL.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                          <h5 className="font-semibold text-green-800 dark:text-green-200 text-sm mb-2">✅ Cookies essentiels</h5>
                          <p className="text-xs text-green-700 dark:text-green-300">Authentification, navigation, sécurité (pas de consentement requis)</p>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <h5 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-2">📊 Cookies analytiques</h5>
                          <p className="text-xs text-blue-700 dark:text-blue-300">Mesure d&apos;audience et optimisation (consentement requis)</p>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                          <h5 className="font-semibold text-purple-800 dark:text-purple-200 text-sm mb-2">🎯 Cookies fonctionnels</h5>
                          <p className="text-xs text-purple-700 dark:text-purple-300">Personnalisation et préférences (consentement requis)</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                          <strong>⚙️ Gestion :</strong> Vous pouvez modifier vos préférences de cookies à tout moment via votre espace client ou les paramètres de votre navigateur.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">7</span>
                      </div>
                      Responsabilité et garanties
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Notre engagement</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Nous nous engageons à fournir des services de cybersécurité conformes aux meilleures pratiques du secteur et aux standards industriels. Nous mettons en œuvre tous les moyens raisonnables pour assurer la disponibilité et la sécurité de la plateforme.
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Limites de responsabilité</h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                          <li>• Les services sont fournis &quot;en l&apos;état&quot; sans garantie de résultat absolu</li>
                          <li>• Nous ne pouvons garantir une sécurité à 100% (aucune solution n&apos;est infaillible)</li>
                          <li>• Notre responsabilité est limitée aux dommages directs et prévisibles</li>
                          <li>• Exclusion de responsabilité pour les dommages indirects ou immatériels</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🛡️ Votre responsabilité</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Vous restez responsable de la sécurité globale de votre système d&apos;information, de la formation de vos équipes et de l&apos;application des recommandations que nous formulons. Nos services constituent un accompagnement et non une garantie absolue.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">8</span>
                      </div>
                      Droit applicable et juridiction
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚖️ Droit français</h4>
                        <p className="text-sm text-gray-700 dark:text-white/80">
                          Les présentes CGU sont régies par le droit français. Elles sont rédigées en langue française. En cas de traduction, seule la version française fait foi.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🏛️ Résolution des litiges</h4>
                        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                          <p><strong>1. Résolution amiable :</strong> Nous privilégions le dialogue pour résoudre tout différend.</p>
                          <p><strong>2. Médiation :</strong> En cas d&apos;échec, recours possible à la médiation professionnelle.</p>
                          <p><strong>3. Juridiction :</strong> À défaut d&apos;accord, les tribunaux français sont seuls compétents.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">9</span>
                      </div>
                      Modification et évolution des CGU
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">📝 Procédure de modification</h4>
                        <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                          <li>• Notification par email au moins 30 jours avant application</li>
                          <li>• Publication de la nouvelle version sur la plateforme</li>
                          <li>• Possibilité de refuser les modifications substantielles</li>
                          <li>• En cas de refus : résiliation automatique à l&apos;échéance</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <p className="text-purple-800 dark:text-purple-200 text-sm">
                          <strong>🔄 Évolutions :</strong> Les CGU peuvent évoluer pour s&apos;adapter aux nouvelles réglementations, technologies ou services proposés. Votre utilisation continue après modification vaut acceptation des nouvelles conditions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">10</span>
                      </div>
                      Contact et support
                    </h2>
                    <div className="ml-9 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="ios-glass-light rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            👥 Équipe dirigeante
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-purple-600 dark:text-purple-300">Melvyn Thierry-Bellefond</p>
                              <p className="text-gray-600 dark:text-white/70">Responsable technique et design</p>
                            </div>
                            <div>
                              <p className="font-medium text-purple-600 dark:text-purple-300">Thomas Lindeker</p>
                              <p className="text-gray-600 dark:text-white/70">Responsable infrastructure</p>
                            </div>
                            <div>
                              <p className="font-medium text-purple-600 dark:text-purple-300">Nijel Sarmiento</p>
                              <p className="text-gray-600 dark:text-white/70">DPO et support client</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ios-glass-light rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            📞 Nous contacter
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Support technique :</p>
                              <a href="mailto:supportcyna@gmail.com" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                                supportcyna@gmail.com
                              </a>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Questions juridiques :</p>
                              <p className="text-gray-600 dark:text-white/70">Objet : "Juridique - [votre question]"</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Délai de réponse :</p>
                              <p className="text-gray-600 dark:text-white/70">48h ouvrées maximum</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">
                          🛡️ Merci de faire confiance à Cyna pour votre cybersécurité
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white/60">
                          Ces conditions sont effectives depuis le 11 juin 2025 • Version 2.0
                        </p>
                      </div>
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
