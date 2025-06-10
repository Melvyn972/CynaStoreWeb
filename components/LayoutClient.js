"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { Component } from 'react';

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

const ClientLayout = ({ children }) => {
  return (
    <ErrorBoundary>
      <SessionProvider>
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
    </ErrorBoundary>
  );
};

export default ClientLayout;
