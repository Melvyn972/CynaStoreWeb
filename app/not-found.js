import Link from "next/link";

// Page 404 simple avec un bouton pour retourner à l'accueil
export default function Custom404() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200 dark:bg-[#0B0F1C]">
      <div className="w-full max-w-3xl text-center">
        <div className="px-6 py-8 md:px-10 md:py-12 dark:bg-white/5 bg-white/80 backdrop-blur-md rounded-2xl border dark:border-gray-800 border-gray-200 dark:shadow-none shadow-lg shadow-gray-200/50">
          <div className="flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br dark:from-purple-600/20 dark:to-blue-600/20 from-purple-500/10 to-blue-500/10 dark:border-purple-500/30 border-purple-500/20 border mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-10 h-10 text-purple-600 dark:text-purple-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">404</span> - Page non trouvée
            </h1>
            
            <p className="text-lg dark:text-gray-300 text-gray-600 mb-8 max-w-lg mx-auto">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
            
            
            <Link 
              href="/" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 text-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                    clipRule="evenodd"
                  />
                </svg>
                Retour à l&apos;accueil
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
