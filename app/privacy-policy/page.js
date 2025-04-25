// app/privacy-policy/page.js
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer"; // ← your footer component

export const metadata = getSEOTags({
  title: `Politique de Confidentialité | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

export default function PrivacyPolicy() {
  return (
    <>
      <main
        className="relative w-full min-h-screen flex flex-col items-center justify-center
                   bg-gradient-to-b from-base-100 to-base-200 dark:bg-black
                   text-base-content dark:text-white overflow-hidden py-24"
      >
        {/* Overlay léger */}
        <div
          className="absolute inset-0
                     bg-gradient-to-br from-base-100 via-base-100 to-base-200/90
                     dark:from-black dark:via-black dark:to-gray-900
                     opacity-90 z-0"
        />

        {/* Décorations circulaires */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full
                        bg-purple-300/20 dark:bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full
                        bg-blue-300/20 dark:bg-blue-500/10 blur-3xl" />

        {/* Conteneur principal */}
        <div
          className="relative z-10 max-w-5xl w-full mx-auto
                     bg-white dark:bg-gray-900 rounded-xl shadow-lg
                     overflow-hidden"
        >
          <div className="p-8">
            {/* Bouton Retour */}
            <Link
              href="/"
              className="inline-flex items-center mb-6 text-base-content dark:text-white hover:underline"
            >
              ← Retour à l’accueil
            </Link>

            {/* Titre gradient */}
            <h1
              className="text-3xl font-extrabold mb-6
                         bg-clip-text text-transparent
                         bg-gradient-to-r from-purple-600 to-blue-600
                         dark:from-white dark:to-gray-300"
            >
              Politique de Confidentialité – {config.appName}
            </h1>

            {/* Contenu de la politique */}
            <pre
              className="leading-relaxed whitespace-pre-wrap text-left"
              style={{ fontFamily: "sans-serif" }}
            >{`Dernière mise à jour : 24 avril 2025

Merci de visiter Cyna ("nous", "notre" ou "nos"). Cette Politique de Confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles et non personnelles lorsque vous utilisez notre site web accessible à l'adresse https://Cyna.fr ("le Site").

En accédant ou en utilisant le Site, vous acceptez les termes de cette Politique de Confidentialité.

1. Données collectées

1.1 Données personnelles
Nous collectons les informations suivantes :
- Nom : pour personnaliser votre expérience et faciliter la communication.
- Adresse e-mail : pour vous envoyer des informations liées à vos commandes, notifications importantes, et communications.
- Informations de paiement : pour traiter vos commandes de manière sécurisée. Ces données ne sont pas stockées sur nos serveurs et sont traitées via un prestataire de paiement sécurisé.

1.2 Données non personnelles
Nous utilisons des cookies pour collecter des informations non personnelles telles que l'adresse IP, le type de navigateur, les informations sur l'appareil, et les habitudes de navigation. Cela nous aide à améliorer votre expérience, analyser les tendances et optimiser nos services.

2. Finalité de la collecte
Les données collectées sont utilisées exclusivement pour le traitement des commandes, l’envoi de confirmations, le support client et le suivi des statuts de commande.

3. Partage des données
Nous ne partageons vos données personnelles avec aucun tiers, sauf si cela est strictement nécessaire au traitement de votre commande (ex. : prestataire de paiement). Nous ne vendons, n’échangeons ou ne louons vos données à aucun tiers.

4. Protection des enfants
Cyna ne s’adresse pas aux enfants de moins de 13 ans. Nous ne collectons pas sciemment de données personnelles auprès d’enfants. Si vous êtes un parent ou tuteur et que vous pensez que votre enfant nous a transmis des données personnelles, contactez-nous à l’adresse indiquée ci-dessous.

5. Modifications de la politique
Cette Politique de Confidentialité peut être modifiée à tout moment. En cas de changement significatif, nous vous en informerons par e-mail. Les mises à jour seront également disponibles sur cette page.

6. Contact
Pour toute question ou demande concernant cette Politique de Confidentialité, vous pouvez nous contacter à l'adresse suivante :

Email : supportcyna@gmail.com

En utilisant Cyna, vous acceptez les termes de cette Politique de Confidentialité.`}</pre>
          </div>
        </div>
      </main>

      {/* Ton footer */}
      <Footer />
    </>
  );
}
