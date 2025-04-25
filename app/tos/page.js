// app/tos/page.js
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";

export const metadata = getSEOTags({
  title: `Conditions Générales d'Utilisation | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

export default function TOS() {
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

        {/* Décos circulaires */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full
                        bg-purple-300/20 dark:bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full
                        bg-blue-300/20 dark:bg-blue-500/10 blur-3xl" />

        {/* Conteneur */}
        <div
          className="relative z-10 max-w-5xl w-full mx-auto
                     bg-white dark:bg-gray-900 rounded-xl shadow-lg
                     overflow-hidden"
        >
          <div className="p-8">
            {/* Bouton retour */}
            <Link
              href="/"
              className="inline-flex items-center mb-6 text-base-content dark:text-white hover:underline"
            >
              ← Retour à l’accueil
            </Link>

            {/* Titre en gradient */}
            <h1
              className="text-3xl font-extrabold mb-6
                         bg-clip-text text-transparent
                         bg-gradient-to-r from-purple-600 to-blue-600
                         dark:from-white dark:to-gray-300"
            >
              Conditions Générales d'Utilisation – {config.appName}
            </h1>

            {/* Contenu */}
            <pre
              className="leading-relaxed whitespace-pre-wrap text-left"
              style={{ fontFamily: "sans-serif" }}
            >{`Dernière mise à jour : 24 avril 2025

Bienvenue sur Cyna.fr !

Les présentes Conditions Générales d'Utilisation ("Conditions") s'appliquent à l'utilisation du site https://Cyna.fr ("le Site") ainsi qu'aux services SaaS proposés par la société Cyna, SAS. En accédant au Site ou en utilisant nos services, vous acceptez les présentes Conditions.

1. Présentation de Cyna

Cyna est un pure player en cybersécurité pour les PME et MSP. Nous plaçons la qualité de service au cœur de notre activité, en valorisant l'expertise, la proximité et la rapidité d'exécution.

2. Propriété intellectuelle

L'ensemble des contenus présents sur le Site, y compris les textes, visuels, logos et éléments techniques, sont la propriété exclusive de Cyna ou de ses partenaires. Toute reproduction ou utilisation non autorisée est interdite.

3. Données personnelles

Nous collectons les données suivantes : nom, adresse e-mail et informations de paiement. Ces données sont nécessaires à la gestion de nos services. Pour en savoir plus, consultez notre politique de confidentialité : https://Cyna.fr/privacy-policy

4. Cookies

Nous utilisons des cookies pour améliorer l'expérience utilisateur, mesurer l’audience et optimiser notre service.

5. Droit applicable

Les présentes Conditions sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.

6. Modification des Conditions

Cyna peut modifier les présentes Conditions à tout moment. Toute mise à jour vous sera communiquée par e-mail.

7. Contact

Pour toute question concernant ces Conditions, veuillez nous contacter à : supportcyna@gmail.com

Merci d’utiliser Cyna.`}</pre>
          </div>
        </div>
      </main>

      {/* Footer commun */}
      <Footer />
    </>
  );
}
