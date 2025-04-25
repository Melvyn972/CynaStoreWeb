// app/contact/page.js
import Link from "next/link";
import Footer from "@/components/Footer";

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
                     overflow-hidden flex flex-col md:flex-row"
        >
          {/* Colonne gauche */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center text-left">
            <h1
              className="text-4xl font-bold mb-4
                         bg-clip-text text-transparent
                         bg-gradient-to-r from-purple-600 to-blue-600
                         dark:from-white dark:to-gray-300"
            >
              Vous avez un besoin ou une question ?
            </h1>
            <p className="text-xl font-medium mb-6">
              Contactez-nous, nous vous répondrons rapidement.
            </p>
            <div className="space-y-2 text-base-content dark:text-white">
              <p className="font-semibold">Adresse :</p>
              <p>10 rue de Penthièvre, 75008 Paris</p>
              <p className="text-blue-600 dark:text-blue-400 hover:underline">
                +33 1 89 70 14 36
              </p>
              <p className="text-blue-600 dark:text-blue-400 hover:underline">
                contact@cyna-it.fr
              </p>
            </div>
          </div>

          {/* Colonne droite : formulaire */}
          <div className="md:w-1/2 p-8 bg-base-200 dark:bg-gray-800">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-1 font-medium text-base-content dark:text-white"
                >
                  Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className="w-full px-4 py-2
                             border border-base-300 dark:border-white/10
                             bg-white dark:bg-gray-700
                             rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-1 font-medium text-base-content dark:text-white"
                >
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="w-full px-4 py-2
                             border border-base-300 dark:border-white/10
                             bg-white dark:bg-gray-700
                             rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-base-content dark:text-white"
                >
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2
                             border border-base-300 dark:border-white/10
                             bg-white dark:bg-gray-700
                             rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 font-medium text-base-content dark:text-white"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2
                             border border-base-300 dark:border-white/10
                             bg-white dark:bg-gray-700
                             rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3
                           bg-gradient-to-r from-purple-600 to-blue-600
                           hover:from-purple-700 hover:to-blue-700
                           text-white font-medium rounded transition"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>

        {/* Lien retour */}
        <div className="relative z-10 mt-8 text-center">
          <Link
            href="/"
            className="inline-block text-base-content dark:text-white hover:underline"
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
