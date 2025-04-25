"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Création du contexte de thème
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Provider pour le contexte de thème
export const ThemeProvider = ({ children }) => {
  // État pour stocker le thème actuel (dark ou light)
  const [theme, setTheme] = useState("light");
  
  // Effet pour initialiser le thème depuis localStorage ou les préférences système
  useEffect(() => {
    // Récupération du thème depuis localStorage s'il existe
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme) {
      // Si un thème est stocké, on l'utilise
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Sinon on utilise les préférences système (mode sombre)
      setTheme("dark");
    }
    
    // Appliquer le thème au document
    applyTheme(storedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"));
  }, []);
  
  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };
  
  // Fonction pour appliquer le thème au document
  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "cynaStore-dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "cynaStore");
    }
  };
  
  // Valeur du contexte
  const value = {
    theme,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 