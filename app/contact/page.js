// app/contact/page.js
import Link from "next/link";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export const metadata = {
  title: "Contact | Cyna",
  description:
    "Contactez l'équipe Cyna pour toute question ou besoin d'information.",
};

export default function ContactPage() {
  return (
    <>
      <main
        className="relative w-full min-h-screen flex flex-col items-center justify-center
                   text-white overflow-hidden py-24"
      >
        <BackgroundEffects />

        {/* Conteneur principal */}
        <div
          className="relative z-20 max-w-5xl w-full mx-auto
                     dashboard-card
                     overflow-hidden flex flex-col md:flex-row"
        >
          {/* Colonne gauche */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center text-left">
            <h1 className="ios-title text-4xl mb-4">
              Vous avez un besoin ou une question ?
            </h1>
            <p className="ios-body text-xl mb-6">
              Contactez-nous, nous vous répondrons rapidement.
            </p>
            <div className="space-y-2 text-black dark:text-white">
              <p className="font-semibold">Adresse :</p>
              <p className="text-black/80 dark:text-white/80">10 rue de Penthièvre, 75008 Paris</p>
              <p className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline">
                +33 1 89 70 14 36
              </p>
              <p className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline">
                contact@cyna-it.fr
              </p>
            </div>
          </div>

          {/* Colonne droite : formulaire */}
          <div className="md:w-1/2 p-8 ios-glass-light">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="ios-label"
                >
                  Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className="ios-input"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="ios-label"
                >
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="ios-input"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="ios-label"
                >
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="ios-input"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="ios-label"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="ios-input h-32 resize-none"
                />
              </div>
              <button
                type="submit"
                className="ios-button-primary w-full"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>

        {/* Lien retour */}
        <div className="relative z-20 mt-8 text-center">
          <Link
            href="/"
            className="ios-button-secondary"
          >
            ← Retour à l’accueil
          </Link>
        </div>
      </main>

      {/* Footer commun */}
      <Footer />
    </>
  );
}
