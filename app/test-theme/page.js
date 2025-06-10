'use client';

import BackgroundEffects from '../components/BackgroundEffects';
import ThemeToggle from '../components/ThemeToggle';

export default function TestTheme() {
  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      
      <div className="relative z-20 pt-24 pb-20">
        <div className="ios-container px-6 md:px-10 mx-auto">
          
          {/* Header avec toggle */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="ios-title">Test du thème</h1>
            <ThemeToggle />
          </div>
          
          {/* Grille de test des composants */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Cards */}
            <div className="ios-card p-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Card de test</h3>
              <p className="ios-body mb-4">
                Ce texte devrait s'adapter automatiquement au thème choisi.
              </p>
              <button className="ios-button-primary w-full">
                Bouton principal
              </button>
            </div>
            
            {/* Glass Effect */}
            <div className="ios-glass-light p-6 rounded-3xl">
              <h3 className="filter-title">Effet verre</h3>
              <p className="ios-body mb-4">
                L'effet de verre doit être visible dans les deux thèmes.
              </p>
              <button className="ios-button-secondary w-full">
                Bouton secondaire
              </button>
            </div>
            
            {/* Inputs */}
            <div className="ios-card p-6">
              <h3 className="ios-label">Formulaire</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nom d'utilisateur"
                  className="ios-input"
                />
                <input 
                  type="email" 
                  placeholder="email@exemple.com"
                  className="ios-input"
                />
                <select className="ios-input">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="dashboard-card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="dashboard-stat-value">142</div>
              <div className="dashboard-stat-label">Éléments</div>
            </div>
            
            {/* Filtres */}
            <div className="filter-container">
              <h3 className="filter-title">Filtres</h3>
              <div className="space-y-3">
                <label className="filter-item">
                  <input type="checkbox" className="mr-3" />
                  <span>Option 1</span>
                </label>
                <label className="filter-item">
                  <input type="checkbox" className="mr-3" />
                  <span>Option 2</span>
                </label>
                <label className="filter-item">
                  <input type="checkbox" className="mr-3" />
                  <span>Option 3</span>
                </label>
              </div>
            </div>
            
            {/* Produit */}
            <div className="product-card group">
              <div className="product-image bg-gradient-to-br from-purple-600 to-indigo-600">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="product-content">
                <h4 className="product-title">Produit test</h4>
                <p className="ios-body mb-4">Description du produit qui devrait s'adapter au thème.</p>
                <div className="product-price">99,99 €</div>
              </div>
            </div>
            
          </div>
          
          {/* Section de texte */}
          <div className="mt-16 ios-card p-8">
            <h2 className="ios-subtitle mb-6">Test de typographie</h2>
            <div className="space-y-4">
              <p className="ios-body">
                Ce paragraphe utilise la classe <code className="bg-purple-500/20 px-2 py-1 rounded text-purple-600 dark:text-purple-400">ios-body</code> 
                et devrait s'adapter automatiquement au thème sélectionné.
              </p>
              <p className="text-black/60 dark:text-white/60">
                Ce texte utilise des couleurs conditionnelles avec dark: et devrait être plus discret.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Lien coloré</span>
                <span className="ios-badge-primary">Badge</span>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 ios-glass-light rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Instructions de test</h3>
            <ul className="space-y-2 text-black/80 dark:text-white/80">
              <li>• Utilisez le bouton de toggle en haut à droite pour basculer entre les thèmes</li>
              <li>• Vérifiez que tous les textes sont lisibles dans les deux modes</li>
              <li>• Les cards et effets de verre doivent rester visibles</li>
              <li>• Les couleurs d'accentuation (violet/indigo) restent cohérentes</li>
              <li>• Le background avec effets s'adapte correctement</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
} 