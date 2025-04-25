"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import config from "@/config";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // For email-based auth with NextAuth, registration is the same as sign-in
      // It will create a new user if one doesn't exist with that email
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: config.auth.callbackUrl,
      });

      if (result?.error) {
        setMessage("Une erreur s'est produite. Veuillez réessayer.");
      } else {
        setMessage("Vérifiez votre email pour le lien de connexion!");
      }
    } catch (error) {
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: config.auth.callbackUrl });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:flex-col justify-center px-8 order-1 lg:order-0">
          <div className="mb-10">
            <span className="inline-block py-1 px-3 text-xs dark:bg-white/10 bg-blue-500/10 dark:text-white text-blue-700 rounded-full mb-4">
              Rejoignez-nous
            </span>
            <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">
              Renforcez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">cybersécurité</span> dès aujourd&apos;hui
            </h2>
            <p className="dark:text-gray-300 text-gray-600">
              Créez votre compte pour accéder à notre plateforme de sécurité avancée et protéger votre entreprise contre les cybermenaces modernes.
            </p>
          </div>
          
          <div className="dark:bg-gradient-to-r dark:from-purple-900/20 dark:to-blue-900/20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl dark:border-gray-800 border-gray-200 border p-6 mb-8">
            <div className="flex items-start gap-5 mb-5">
              <div className="w-10 h-10 rounded-full dark:bg-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-purple-600">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="dark:text-white text-gray-900 font-medium mb-1">Installation rapide</h3>
                <p className="dark:text-gray-400 text-gray-600 text-sm">Configuration en moins de 10 minutes, sans compétences techniques requises.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full dark:bg-blue-500/20 bg-blue-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-blue-600">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="dark:text-white text-gray-900 font-medium mb-1">C&apos;est partie</h3>
                <p className="dark:text-gray-400 text-gray-600 text-sm">Commencé avec toutes les fonctionnalités premium disponibles.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="dark:text-gray-300 text-gray-600 text-sm">Surveillance en temps réel 24/7</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="dark:text-gray-300 text-gray-600 text-sm">Protection contre les malwares avancés</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="dark:text-gray-300 text-gray-600 text-sm">Mises à jour automatiques de sécurité</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full dark:bg-green-500/20 bg-green-500/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="dark:text-gray-300 text-gray-600 text-sm">Assistance technique prioritaire</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Register form */}
        <div className="px-6 py-8 md:px-10 md:py-12 dark:bg-white/5 bg-white/80 backdrop-blur-md rounded-2xl border dark:border-gray-800 border-gray-200 dark:shadow-none shadow-lg shadow-gray-200/50 order-0 lg:order-1">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 dark:text-white text-gray-900">Créer un compte</h1>
              <p className="dark:text-gray-300 text-gray-600">Commencez votre dès maintenant</p>
            </div>
            
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 dark:bg-white dark:text-black bg-gray-900 text-white dark:hover:bg-gray-100 hover:bg-gray-800 transition-colors rounded-xl font-medium mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
              </svg>
              S&apos;inscrire avec Google
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t dark:border-gray-800 border-gray-300 w-full"></div>
              <span className="absolute dark:bg-black bg-gray-50 px-3 dark:text-gray-400 text-gray-500 text-sm">OU</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  placeholder="email@exemple.com"
                  className="w-full px-4 py-3 dark:bg-white/5 bg-white dark:border-gray-800 border-gray-300 rounded-xl dark:text-white text-gray-900 dark:focus:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-purple-500 rounded dark:border-gray-700 border-gray-300 dark:bg-gray-900 bg-white focus:ring-purple-500/20"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm dark:text-gray-300 text-gray-600">
                  J&apos;accepte les{" "}
                  <Link href="/tos" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    conditions d&apos;utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy-policy" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    politique de confidentialité
                  </Link>
                </label>
              </div>
              
              {message && (
                <div className={`text-sm p-3 rounded-lg ${message.includes('Vérifiez') ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}>
                  {message}
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  className={`w-full px-5 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 ${isLoading ? 'opacity-80' : ''}`}
                  disabled={isLoading || !agreeTerms}
                >
                  {isLoading ? "Envoi en cours..." : "Créer mon compte"}
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center dark:text-gray-300 text-gray-500 text-sm">
              Vous avez déjà un compte?{" "}
              <Link href="/auth/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 