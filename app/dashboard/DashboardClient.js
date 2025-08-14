"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardClient({ initialData }) {
  const [stats, setStats] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Fonction pour rafraîchir les données
  const refreshStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/stats', {
        cache: 'no-store'
      });
      if (response.ok) {
        const newStats = await response.json();
        setStats(newStats);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Rafraîchir quand la page devient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className="ios-grid-4 mb-12 ios-slide-up">
      {/* Indicateur de chargement */}
      {loading && (
        <div className="col-span-4 text-center py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            Mise à jour...
          </div>
        </div>
      )}
      
      {/* Articles achetés */}
      <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="dashboard-stat-value">{stats.totalItems}</div>
        <div className="dashboard-stat-label">Articles achetés</div>
      </div>
      
      {/* Total dépensé */}
      <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <div className="dashboard-stat-value">{stats.totalSpent.toFixed(2)} €</div>
        <div className="dashboard-stat-label">Total dépensé</div>
      </div>
      
      {/* Mes entreprises */}
      <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className="dashboard-stat-value">{stats.totalCompanies}</div>
        <div className="dashboard-stat-label">Entreprises</div>
      </div>
      
      {/* Invitations en attente */}
      <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <div className="dashboard-stat-value">{stats.pendingInvitations}</div>
        <div className="dashboard-stat-label">Invitations</div>
      </div>
      
      {/* Bouton de rafraîchissement manuel */}
      <div className="col-span-4 text-center mt-4">
        <button
          onClick={refreshStats}
          disabled={loading}
          className="ios-button-secondary text-sm inline-flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Mise à jour...' : 'Actualiser'}
        </button>
      </div>
    </div>
  );
}
