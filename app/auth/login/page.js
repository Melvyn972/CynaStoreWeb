"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import config from "@/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // For demonstration, we'll support both credential and email auth
      // In a real app, you might use just one method
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: config.auth.callbackUrl,
      });

      if (result?.error) {
        setMessage("Identifiants incorrects. Veuillez réessayer.");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: config.auth.callbackUrl });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="px-6 py-8 md:px-10 md:py-12 dark:bg-white/5 bg-white/80 backdrop-blur-md rounded-2xl border dark:border-gray-800 border-gray-200 dark:shadow-none shadow-lg shadow-gray-200/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br dark:from-purple-600/20 dark:to-blue-600/20 from-purple-500/10 to-blue-500/10 dark:border-purple-500/30 border-purple-500/20 border mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-700">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-2">Connexion</h1>
            <p className="dark:text-gray-300 text-gray-600">
              Accédez à votre compte pour continuer
            </p>
          </div>

          {message && (
            <div className={`mb-6 text-sm p-4 rounded-lg ${message.includes('envoyé') ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}>
              {message}
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-3 px-5 border dark:border-gray-800 border-gray-300 rounded-xl dark:text-white text-gray-700 dark:hover:bg-white/5 hover:bg-gray-100 transition-colors"
              type="button"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuer avec Google
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="h-px dark:bg-gray-800 bg-gray-300 flex-1"></div>
            <span className="dark:text-gray-400 text-gray-500 text-sm">ou</span>
            <div className="h-px dark:bg-gray-800 bg-gray-300 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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


            <div>
              <button
                type="submit"
                className={`w-full px-5 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 ${isLoading ? 'opacity-80' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center dark:text-gray-300 text-gray-500 text-sm">
            Vous n&apos;avez pas de compte?{" "}
            <Link href="/auth/register" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 