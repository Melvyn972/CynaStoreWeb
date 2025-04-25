// app/about/page.js
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import Footer from "@/components/Footer";

export const metadata = getSEOTags({
  title: `À propos | ${config.appName}`,
  canonicalUrlRelative: "/about",
});

export default function AboutPage() {
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

        {/* Contenu */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          {/* Bouton retour */}
          <Link
            href="/"
            className="inline-flex items-center mb-8 text-base-content dark:text-white hover:underline"
          >
            ← Retour à l’accueil
          </Link>

          {/* Titre gradient */}
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6
                       bg-clip-text text-transparent
                       bg-gradient-to-r from-purple-600 to-blue-600
                       dark:from-white dark:to-gray-300"
          >
            À propos de {config.appName}
          </h1>

          {/* Pill sensibilisation */}
          <span
            className="inline-block py-1 px-3 mb-8 text-sm font-medium rounded-full
                       bg-gradient-to-r from-purple-500/10 to-blue-500/10
                       dark:bg-white/10 backdrop-blur-md"
          >
            🔒 Protection des données & vie privée
          </span>

          {/* Message de sensibilisation */}
          <section className="mb-12 text-left leading-relaxed space-y-4">
            <p>
              Chez <strong>{config.appName}</strong>, la confidentialité et la
              sécurité de vos données sont au cœur de nos priorités. Nous vous
              invitons à :
            </p>
            <ul className="list-disc list-inside">
              <li>Vérifier vos préférences de confidentialité dans votre compte.</li>
              <li>Nous signaler toute activité suspecte ou fuite potentielle.</li>
              <li>Consulter notre Politique de Confidentialité et notre RGPD.</li>
            </ul>
          </section>

          {/* Présentation de l’équipe */}
          <section className="text-left leading-relaxed whitespace-pre-wrap font-sans">
            {`Dernière mise à jour : 25 avril 2025

Bienvenue sur ${config.appName} !
Nous sommes trois développeurs :

- Melvyn : frontend & design.
- Thomas : backend & base de données.
- Nijel : documentation, support technique & RGPD.

Notre objectif : vous offrir un site fiable, rapide et facile à utiliser.`}
          </section>
        </div>
      </main>

      {/* Footer commun */}
      <Footer />
    </>
  );
}
