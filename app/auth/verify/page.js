"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const isLoginVerification = searchParams.get("in") === "login";

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token && !isLoginVerification) {
      setStatus("error");
      return;
    }

    // The page will automatically redirect if the token is valid
    // This is just a fallback in case something goes wrong
    const timeout = setTimeout(() => {
      setStatus("timeout");
    }, 10000);

    return () => clearTimeout(timeout);
  }, [searchParams, isLoginVerification]);

  // If this is the verification request page after login
  if (isLoginVerification) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="px-6 py-8 md:px-10 md:py-12 dark:bg-white/5 bg-white/80 backdrop-blur-md rounded-2xl border dark:border-gray-800 border-gray-200 dark:shadow-none shadow-lg shadow-gray-200/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br dark:from-purple-600/20 dark:to-blue-600/20 from-purple-500/10 to-blue-500/10 dark:border-purple-500/30 border-purple-500/20 border mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-700">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-2">Vérification de votre email</h1>
              <p className="dark:text-gray-300 text-gray-600">
                Nous avons envoyé un email de vérification
              </p>
            </div>
            
            <div className="mb-6 text-sm p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300">
              Veuillez vérifier votre boîte de réception et cliquer sur le lien pour terminer la connexion.
            </div>
            
            <div className="mt-6 text-center dark:text-gray-300 text-gray-500 text-sm">
              Retourner à la{" "}
              <Link href="/auth/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium">
                page de connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="px-6 py-8 md:px-10 md:py-12 dark:bg-white/5 bg-white/80 backdrop-blur-md rounded-2xl border dark:border-gray-800 border-gray-200 dark:shadow-none shadow-lg shadow-gray-200/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br dark:from-purple-600/20 dark:to-blue-600/20 from-purple-500/10 to-blue-500/10 dark:border-purple-500/30 border-purple-500/20 border mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-700">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-2">Vérification de votre email</h1>
          </div>
          
          {status === "verifying" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-t-2 border-purple-600 border-r-2 border-b-2 border-l-purple-600/50 rounded-full animate-spin"></div>
              </div>
              <p className="text-center dark:text-gray-300 text-gray-600">Veuillez patienter pendant que nous vérifions votre email...</p>
            </>
          )}

          {status === "error" && (
            <div className="mb-6 text-sm p-4 rounded-lg bg-red-500/10 text-red-700 dark:text-red-300">
              Lien de vérification invalide. Veuillez réessayer de vous connecter.
              <div className="mt-4 text-center">
                <Link href="/auth/login" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200">
                  Retourner à la connexion
                </Link>
              </div>
            </div>
          )}

          {status === "timeout" && (
            <div className="mb-6 text-sm p-4 rounded-lg bg-yellow-500/10 text-yellow-700 dark:text-yellow-300">
              La vérification prend plus de temps que prévu. Si vous n&apos;êtes pas redirigé automatiquement, veuillez réessayer de vous connecter.
              <div className="mt-4 text-center">
                <Link href="/auth/login" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200">
                  Retourner à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 