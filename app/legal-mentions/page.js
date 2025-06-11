import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const metadata = getSEOTags({
  title: `Mentions Légales | ${config.appName}`,
  canonicalUrlRelative: "/legal-mentions",
});

export default function LegalMentions() {
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
                Mentions Légales
              </h1>
              <p className="ios-body text-lg">
                Informations légales obligatoires
              </p>
            </div>

            {/* Contenu */}
            <div className="dashboard-card ios-slide-up">
              <div className="prose prose-gray dark:prose-invert prose-purple max-w-none">
                <div className="ios-body space-y-6 leading-relaxed">
                  
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Identification de l&apos;éditeur
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">🏢 Structure juridique</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                          La plateforme Cyna est éditée conjointement par trois personnes physiques agissant en copropriété :
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                            <p className="font-semibold text-purple-600 dark:text-purple-300">Melvyn Thierry-Bellefond</p>
                            <p className="text-xs text-gray-600 dark:text-white/70 mt-1">
                              Personne physique<br/>
                              Responsable technique et design<br/>
                              Co-éditeur - Part : 1/3
                            </p>
                          </div>
                          
                          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                            <p className="font-semibold text-purple-600 dark:text-purple-300">Thomas Lindeker</p>
                            <p className="text-xs text-gray-600 dark:text-white/70 mt-1">
                              Personne physique<br/>
                              Responsable infrastructure<br/>
                              Co-éditeur - Part : 1/3
                            </p>
                          </div>
                          
                          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4">
                            <p className="font-semibold text-purple-600 dark:text-purple-300">Nijel Sarmiento</p>
                            <p className="text-xs text-gray-600 dark:text-white/70 mt-1">
                              Personne physique<br/>
                              DPO et support client<br/>
                              Co-éditeur - Part : 1/3
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📧 Contact éditeur</h4>
                        <p className="text-sm text-gray-700 dark:text-white/80">
                          Email : <a href="mailto:supportcyna@gmail.com" className="text-purple-600 dark:text-purple-400 hover:underline">supportcyna@gmail.com</a><br/>
                          Site web : <a href="https://cyna.fr" className="text-purple-600 dark:text-purple-400 hover:underline">https://cyna.fr</a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Hébergement et infrastructure
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">☁️ Hébergeur principal</h4>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          <p><strong>Amazon Web Services Europe</strong></p>
                          <p>AWS Europe (Ireland) Limited</p>
                          <p>One Burlington Plaza, Burlington Road</p>
                          <p>Dublin 4, D04 E4X0, Irlande</p>
                          <p>Site web : <a href="https://aws.amazon.com" className="underline">aws.amazon.com</a></p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🌐 Services techniques</h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• <strong>CDN :</strong> Cloudflare Inc. (États-Unis) - Conformité GDPR</li>
                          <li>• <strong>DNS :</strong> Cloudflare (Données hébergées en Europe)</li>
                          <li>• <strong>Monitoring :</strong> Infrastructure européenne exclusivement</li>
                          <li>• <strong>Base de données :</strong> AWS RDS Europe (Dublin)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      Directeur de publication et modération
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">📝 Direction de la publication</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          La direction de la publication est assurée collégialement par les trois co-éditeurs :
                        </p>
                        <ul className="text-sm text-purple-700 dark:text-purple-300 mt-2 space-y-1">
                          <li>• <strong>Melvyn Thierry-Bellefond</strong> - Contenu technique et design</li>
                          <li>• <strong>Thomas Lindeker</strong> - Documentation infrastructure</li>
                          <li>• <strong>Nijel Sarmiento</strong> - Contenu juridique et support</li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">🛡️ Modération des contenus</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          La plateforme Cyna étant à usage professionnel B2B, les contenus utilisateurs sont principalement constitués de données techniques de cybersécurité. Une modération automatique et manuelle est mise en place pour garantir la qualité et la conformité des contenus.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      Propriété intellectuelle et droits d&apos;auteur
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">© Droits réservés</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                          L&apos;ensemble de la plateforme Cyna est protégé par le droit d&apos;auteur français et international :
                        </p>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          <li>• Code source : © 2024 Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento</li>
                          <li>• Design et interface : © 2024 Melvyn Thierry-Bellefond</li>
                          <li>• Documentation : © 2024 Nijel Sarmiento</li>
                          <li>• Architecture : © 2024 Thomas Lindeker</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🔒 Licences et autorisations</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Toute utilisation, reproduction, représentation, modification ou exploitation de tout ou partie de la plateforme sans autorisation écrite des titulaires des droits est strictement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">5</span>
                      </div>
                      Données personnelles et RGPD
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🛡️ Responsables de traitement</h4>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                          Les trois co-éditeurs sont conjointement responsables du traitement des données personnelles :
                        </p>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">
                          <p><strong>Délégué à la Protection des Données (DPO) :</strong> Nijel Sarmiento</p>
                          <p><strong>Contact DPO :</strong> supportcyna@gmail.com (objet : "RGPD - [votre demande]")</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📋 Documentation RGPD</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Pour toutes informations sur le traitement de vos données personnelles, consultez notre 
                          <Link href="/privacy-policy" className="font-semibold hover:underline ml-1">
                            Politique de confidentialité
                          </Link>
                          qui détaille vos droits, nos obligations et les mesures de sécurité mises en place.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Cookies et traceurs
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-700">
                        <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">🍪 Utilisation des cookies</h4>
                        <p className="text-sm text-teal-700 dark:text-teal-300 mb-2">
                          Conformément à l&apos;article 82 de la loi Informatique et Libertés et aux directives CNIL, nous utilisons des cookies pour :
                        </p>
                        <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-1">
                          <li>• Assurer le fonctionnement technique de la plateforme</li>
                          <li>• Améliorer l&apos;expérience utilisateur (avec votre consentement)</li>
                          <li>• Mesurer l&apos;audience de manière anonymisée (avec votre consentement)</li>
                          <li>• Garantir la sécurité des connexions</li>
                        </ul>
                      </div>
                      
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-700">
                        <p className="text-cyan-800 dark:text-cyan-200 text-sm">
                          <strong>⚙️ Gestion :</strong> Vous pouvez à tout moment modifier vos préférences de cookies via votre espace client ou les paramètres de votre navigateur.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">7</span>
                      </div>
                      Droit applicable et juridictions
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚖️ Droit français</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
                        </p>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🏛️ Autorités compétentes</h4>
                        <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                          <li>• <strong>CNIL :</strong> Protection des données personnelles</li>
                          <li>• <strong>INPI :</strong> Propriété intellectuelle</li>
                          <li>• <strong>ARCOM :</strong> Communication audiovisuelle</li>
                          <li>• <strong>Médiateur de la consommation :</strong> Litiges commerciaux</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">8</span>
                      </div>
                      Contact et signalement
                    </h2>
                    <div className="ml-9 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📞 Contact général</h4>
                          <div className="text-sm text-gray-700 dark:text-white/80 space-y-1">
                            <p><strong>Email :</strong> supportcyna@gmail.com</p>
                            <p><strong>Réponse :</strong> 48h ouvrées maximum</p>
                            <p><strong>Langue :</strong> Français, Anglais</p>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🚨 Signalement</h4>
                          <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                            <p><strong>Contenu illicite :</strong> Objet "SIGNALEMENT"</p>
                            <p><strong>Violation droits :</strong> Objet "VIOLATION PI"</p>
                            <p><strong>Incident sécurité :</strong> Objet "INCIDENT"</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-white/60">
                          Mentions légales mises à jour le 11 juin 2025 • Conformes au droit français en vigueur
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