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
                Dernière mise à jour : 11 juin 2025
              </p>
            </div>

            {/* Contenu */}
            <div className="dashboard-card ios-slide-up">
              <div className="prose prose-gray dark:prose-invert prose-purple max-w-none">
                <div className="ios-body space-y-6 leading-relaxed">
                  {/* Responsables de traitement */}
                  <div className="ios-glass-light rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Responsables de traitement</h3>
                    <p className="text-gray-700 dark:text-white/80 mb-4">
                      Cyna est détenue et exploitée conjointement par trois personnes physiques en qualité de responsables de traitement au sens de l&apos;article 4.7 du RGPD :
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <p className="font-semibold text-purple-600 dark:text-purple-300">Melvyn Thierry-Bellefond</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">Frontend & Design</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <p className="font-semibold text-purple-600 dark:text-purple-300">Thomas Lindeker</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">Backend & Base de données</p>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                        <p className="font-semibold text-purple-600 dark:text-purple-300">Nijel Sarmiento</p>
                        <p className="text-sm text-gray-600 dark:text-white/70">Documentation & Support RGPD</p>
                      </div>
                    </div>
                  </div>

                  <p>
                    Cette Politique de Confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données personnelles dans le cadre de l&apos;utilisation de notre plateforme de cybersécurité accessible à l&apos;adresse https://cyna.fr (&quot;la Plateforme&quot;) et de nos services SaaS de cybersécurité pour PME et MSP.
                  </p>
                  
                  <p>
                    Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) et aux dernières directives de la CNIL 2024.
                  </p>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Données collectées et bases légales
                    </h2>
                    
                    <div className="space-y-6 ml-9">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">1.1 Données d&apos;identification et de contact</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-white/80 mb-2"><strong>Données collectées :</strong></p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-white/70">
                            <li>Nom et prénom</li>
                            <li>Adresse e-mail professionnelle</li>
                            <li>Numéro de téléphone (optionnel)</li>
                            <li>Fonction et nom de l&apos;entreprise</li>
                          </ul>
                          <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                            <strong>Base légale :</strong> Exécution du contrat (art. 6.1.b RGPD) et intérêts légitimes (art. 6.1.f RGPD)
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">1.2 Données de connexion et d&apos;utilisation</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-white/70">
                            <li>Adresse IP (anonymisée après 13 mois)</li>
                            <li>Logs de connexion et d&apos;activité</li>
                            <li>Données de navigation (pages visitées, durée)</li>
                            <li>Informations techniques (navigateur, OS, appareil)</li>
                            <li>Cookies d&apos;authentification et de préférence</li>
                          </ul>
                          <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                            <strong>Base légale :</strong> Intérêts légitimes pour la sécurité et l&apos;amélioration des services
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">1.3 Données de cybersécurité</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-white/70">
                            <li>Configuration de sécurité de votre infrastructure</li>
                            <li>Rapports de vulnérabilités (anonymisés)</li>
                            <li>Métadonnées des audits de sécurité</li>
                            <li>Incidents de sécurité détectés</li>
                          </ul>
                          <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                            <strong>Base légale :</strong> Exécution du contrat et consentement explicite pour les données sensibles
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">1.4 Données de paiement</h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-white/80 mb-2">
                            Les données de paiement sont traitées exclusivement par nos prestataires certifiés PCI-DSS :
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-white/70">
                            <li>Stripe (certification PCI Level 1)</li>
                            <li>PayPal (certifié PCI-DSS)</li>
                          </ul>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            <strong>Important :</strong> Aucune donnée bancaire n&apos;est stockée sur nos serveurs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Finalités et durées de conservation
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="grid gap-4">
                        <div className="border-l-4 border-emerald-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">🔐 Prestation de services de cybersécurité</h4>
                          <p className="text-sm text-gray-600 dark:text-white/70">Exécution des audits, surveillance, réponse aux incidents | <strong>Durée :</strong> Durée du contrat + 3 ans</p>
                        </div>
                        
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">📊 Amélioration et optimisation</h4>
                          <p className="text-sm text-gray-600 dark:text-white/70">Analytics anonymisées, développement produit | <strong>Durée :</strong> 25 mois maximum</p>
                        </div>
                        
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">💬 Support et communication</h4>
                          <p className="text-sm text-gray-600 dark:text-white/70">Support technique, notifications sécuritaires | <strong>Durée :</strong> 3 ans après dernière interaction</p>
                        </div>
                        
                        <div className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">⚖️ Obligations légales</h4>
                          <p className="text-sm text-gray-600 dark:text-white/70">Conformité réglementaire, obligations comptables | <strong>Durée :</strong> 10 ans (Code de commerce)</p>
                        </div>
                        
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white">🛡️ Sécurité et lutte contre la fraude</h4>
                          <p className="text-sm text-gray-600 dark:text-white/70">Détection d&apos;intrusions, prévention des cyberattaques | <strong>Durée :</strong> 13 mois pour les IP, 6 ans pour les incidents</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>⚠️ Suppression automatique :</strong> Vos données sont automatiquement supprimées à l&apos;expiration des durées mentionnées, sauf obligation légale contraire.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      Vos droits RGPD
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p className="text-gray-700 dark:text-white/80">
                        Conformément au RGPD, vous disposez des droits suivants que vous pouvez exercer à tout moment :
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🔍 Droit d&apos;accès (Art. 15)</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Obtenir une copie de vos données et informations sur leur traitement</p>
                        </div>
                        
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✏️ Droit de rectification (Art. 16)</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">Corriger des données inexactes ou incomplètes</p>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🗑️ Droit d&apos;effacement (Art. 17)</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">Suppression de vos données (sous conditions)</p>
                        </div>
                        
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                          <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">⏸️ Droit de limitation (Art. 18)</h4>
                          <p className="text-sm text-orange-700 dark:text-orange-300">Limiter le traitement dans certains cas</p>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                          <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">📦 Droit de portabilité (Art. 20)</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">Récupérer vos données dans un format structuré</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🚫 Droit d&apos;opposition (Art. 21)</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">S&apos;opposer au traitement pour des raisons légitimes</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">📞 Comment exercer vos droits ?</h4>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                          Contactez notre DPO (Nijel Sarmiento) via :
                        </p>
                        <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                          <li>• Email : <strong>supportcyna@gmail.com</strong> (objet : "Exercice droits RGPD")</li>
                          <li>• Délai de réponse : <strong>1 mois maximum</strong></li>
                          <li>• Justificatif d&apos;identité requis pour la sécurité</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      Partage des données et sous-traitants
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                          🔒 Engagement de confidentialité
                        </p>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Nous ne vendons, n&apos;échangeons ni ne louons jamais vos données personnelles à des tiers à des fins commerciales.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Partage strictement nécessaire avec :</h4>
                        <div className="space-y-3">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-gray-900 dark:text-white">🏦 Prestataires de paiement</h5>
                            <p className="text-sm text-gray-600 dark:text-white/70">Stripe, PayPal (certifiés PCI-DSS) - Finalité : traitement sécurisé des paiements</p>
                          </div>
                          
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h5 className="font-medium text-gray-900 dark:text-white">☁️ Infrastructure cloud</h5>
                            <p className="text-sm text-gray-600 dark:text-white/70">AWS Europe (GDPR compliant) - Finalité : hébergement sécurisé des données</p>
                          </div>
                          
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h5 className="font-medium text-gray-900 dark:text-white">⚖️ Autorités compétentes</h5>
                            <p className="text-sm text-gray-600 dark:text-white/70">Uniquement sur réquisition judiciaire ou obligation légale</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          <strong>🛡️ Garanties :</strong> Tous nos sous-traitants sont liés par des contrats RGPD (art. 28) garantissant le même niveau de protection de vos données.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">5</span>
                      </div>
                      Mesures de sécurité (CNIL 2024)
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p className="text-gray-700 dark:text-white/80">
                        Conformément aux dernières directives CNIL 2024, nous mettons en œuvre les mesures techniques et organisationnelles suivantes :
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🔐 Sécurité technique</h4>
                          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <li>• Chiffrement AES-256 au repos et en transit</li>
                            <li>• Authentification multi-facteurs obligatoire</li>
                            <li>• APIs conformes OWASP Top 10</li>
                            <li>• Audits de sécurité trimestriels</li>
                            <li>• Sauvegarde chiffrée quotidienne</li>
                          </ul>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">👥 Sécurité organisationnelle</h4>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Formation RGPD annuelle du personnel</li>
                            <li>• Politique de mots de passe renforcée</li>
                            <li>• Contrôles d&apos;accès basés sur les rôles</li>
                            <li>• Traçabilité complète des actions</li>
                            <li>• Plan de réponse aux incidents</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🚨 Notification des violations</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          En cas de violation de données susceptible d&apos;engendrer un risque pour vos droits et libertés, nous vous notifierons dans les <strong>72 heures</strong> suivant la découverte, conformément à l&apos;article 34 du RGPD.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Protection des mineurs
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                        <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                          🔞 Services réservés aux professionnels
                        </p>
                        <p className="text-amber-700 dark:text-amber-300 text-sm">
                          Nos services de cybersécurité s&apos;adressent exclusivement aux entreprises et professionnels. Nous ne collectons pas sciemment de données auprès de personnes de moins de 16 ans.
                        </p>
                      </div>
                      
                      <p className="text-gray-700 dark:text-white/80 text-sm">
                        Si vous êtes parent ou tuteur légal et que vous pensez qu&apos;un mineur nous a transmis des données personnelles, contactez-nous immédiatement à <strong>supportcyna@gmail.com</strong> pour suppression immédiate.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">7</span>
                      </div>
                      Transferts internationaux
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                          🇪🇺 Données hébergées en Europe
                        </p>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          Toutes vos données sont stockées et traitées exclusivement dans des centres de données situés dans l&apos;Union Européenne (AWS Europe - Ireland, Frankfurt).
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🛡️ Garanties pour les transferts</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          Si un transfert hors UE s&apos;avérait nécessaire, nous utiliserions uniquement :
                        </p>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Pays disposant d&apos;une décision d&apos;adéquation de la Commission européenne</li>
                          <li>• Clauses contractuelles types (CCT) approuvées par la Commission</li>
                          <li>• Mécanismes de certification appropriés</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">8</span>
                      </div>
                      Cookies et technologies similaires
                    </h2>
                    <div className="ml-9 space-y-4">
                      <p className="text-gray-700 dark:text-white/80">
                        Nous utilisons des cookies et technologies similaires conformément aux directives CNIL. Vous pouvez gérer vos préférences via notre interface dédiée.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                          <h5 className="font-semibold text-green-800 dark:text-green-200 text-sm mb-1">✅ Cookies essentiels</h5>
                          <p className="text-xs text-green-700 dark:text-green-300">Authentification, sécurité, navigation</p>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                          <h5 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1">📊 Cookies analytiques</h5>
                          <p className="text-xs text-blue-700 dark:text-blue-300">Mesure d&apos;audience (avec votre consentement)</p>
                        </div>
                        
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                          <h5 className="font-semibold text-purple-800 dark:text-purple-200 text-sm mb-1">🎯 Cookies marketing</h5>
                          <p className="text-xs text-purple-700 dark:text-purple-300">Personnalisation (avec votre consentement)</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                          <strong>⚙️ Gestion des cookies :</strong> Accédez à vos préférences depuis votre tableau de bord ou via le lien en bas de page. Vous pouvez modifier vos choix à tout moment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">9</span>
                      </div>
                      Modifications de la politique
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📝 Procédure de modification</h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                          <li>• Notification par email 30 jours avant application</li>
                          <li>• Publication de la nouvelle version sur le site</li>
                          <li>• Possibilité de vous opposer aux modifications substantielles</li>
                          <li>• Archivage des versions précédentes sur demande</li>
                        </ul>
                      </div>
                      
                      <p className="text-gray-700 dark:text-white/80 text-sm">
                        Les modifications mineures (corrections typographiques, clarifications) peuvent être appliquées sans notification préalable. Les modifications substantielles nécessitent votre accord explicite.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">10</span>
                      </div>
                      Contact et réclamations
                    </h2>
                    <div className="ml-9 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="ios-glass-light rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            👥 Responsables de traitement
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-purple-600 dark:text-purple-300">Melvyn Thierry-Bellefond</p>
                              <p className="text-gray-600 dark:text-white/70">Frontend & Design</p>
                            </div>
                            <div>
                              <p className="font-medium text-purple-600 dark:text-purple-300">Thomas Lindeker</p>
                              <p className="text-gray-600 dark:text-white/70">Backend & Base de données</p>
                            </div>
                            <div>
                              <p className="font-medium text-purple-600 dark:text-purple-300">Nijel Sarmiento</p>
                              <p className="text-gray-600 dark:text-white/70">Documentation & Support RGPD</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ios-glass-light rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            📞 Nous contacter
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Email :</p>
                              <a href="mailto:supportcyna@gmail.com" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                                supportcyna@gmail.com
                              </a>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Délai de réponse :</p>
                              <p className="text-gray-600 dark:text-white/70">1 mois maximum (RGPD)</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Objet email :</p>
                              <p className="text-gray-600 dark:text-white/70">"RGPD - [votre demande]"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                          ⚖️ Droit de réclamation
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                          Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d&apos;introduire une réclamation auprès de l&apos;autorité de contrôle compétente :
                        </p>
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">CNIL (Commission Nationale de l&apos;Informatique et des Libertés)</p>
                          <p className="text-xs text-red-700 dark:text-red-300">
                            3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07<br/>
                            Tél : 01 53 73 22 22 | Web : <a href="https://www.cnil.fr" className="underline">www.cnil.fr</a>
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-center py-6">
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-300 mb-2">
                          🛡️ Merci de nous faire confiance pour protéger vos données
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white/60">
                          Cette politique est effective depuis le 11 juin 2025 et remplace toutes les versions précédentes.
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
