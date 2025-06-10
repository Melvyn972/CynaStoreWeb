"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Création du contexte de thème
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider pour le contexte de thème
export const ThemeProvider = ({ children }) => {
  // État pour stocker le thème actuel (dark ou light)
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  
  // Effet pour initialiser le thème depuis localStorage ou les préférences système
  useEffect(() => {
    setMounted(true);
    
    try {
      // Récupération du thème depuis localStorage s'il existe
      const storedTheme = localStorage.getItem("theme");
      
      let initialTheme = "light"; // Valeur par défaut
      
      if (storedTheme && (storedTheme === "dark" || storedTheme === "light")) {
        initialTheme = storedTheme;
      } else if (typeof window !== 'undefined' && window.matchMedia) {
        // Vérifier les préférences système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? "dark" : "light";
      }
      
      setTheme(initialTheme);
      applyTheme(initialTheme);
    } catch (error) {
      console.warn('Error initializing theme:', error);
      setTheme("light");
      applyTheme("light");
    }
  }, []);
  
  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    if (!mounted) return;
    
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
    
    applyTheme(newTheme);
  };
  
  // Fonction pour appliquer le thème au document
  const applyTheme = (newTheme) => {
    if (typeof document === 'undefined') return;
    
    try {
      const root = document.documentElement;
      
      if (newTheme === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "cynaStore-dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "cynaStore");
      }
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  };
  
  // Valeur du contexte
  const value = {
    theme,
    toggleTheme,
    mounted,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 