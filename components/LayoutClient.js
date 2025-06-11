"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { Component, useState, useEffect } from 'react';

// ErrorBoundary native React
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quelque chose s&apos;est mal passé
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'Une erreur inattendue s&apos;est produite'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Composant pour gérer l'hydratation
const HydrationProvider = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Marquer comme hydraté après le premier rendu côté client
    setIsHydrated(true);
  }, []);

  return (
    <>
      {children}
      {/* Styles d'urgence pour éviter FOUC pendant l'hydratation */}
      {!isHydrated && (
        <style jsx global>{`
          body {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          body.hydrated {
            opacity: 1;
          }
        `}</style>
      )}
      {isHydrated && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.add('hydrated');`,
          }}
        />
      )}
    </>
  );
};

const ClientLayout = ({ children }) => {
  return (
    <ErrorBoundary>
      <HydrationProvider>
        <SessionProvider
          // Refetch session every 5 minutes
          refetchInterval={5 * 60}
          // Re-fetch session if window is focused
          refetchOnWindowFocus={true}
        >
          <ThemeProvider>
            {children}

            <Toaster
              toastOptions={{
                duration: 3000,
              }}
              position="top-right"
            />

            <Tooltip
              id="tooltip"
              className="z-[60] !opacity-100 max-w-sm shadow-lg"
              place="top"
            />
          </ThemeProvider>
        </SessionProvider>
      </HydrationProvider>
    </ErrorBoundary>
  );
};

export default ClientLayout;
