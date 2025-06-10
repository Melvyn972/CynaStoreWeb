'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0,
    uniqueCustomers: 0
  });

  // États pour les filtres
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'newest',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }
      
      const data = await response.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalItems = ordersData.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const uniqueCustomers = new Set(ordersData.map(order => order.userId)).size;

    setStats({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalItems,
      uniqueCustomers
    });
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Recherche par nom d'utilisateur ou email
    if (filters.search) {
      filtered = filtered.filter(order => 
        order.user?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtrage par prix
    if (filters.priceMin) {
      filtered = filtered.filter(order => {
        const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return orderTotal >= parseFloat(filters.priceMin);
      });
    }

    if (filters.priceMax) {
      filtered = filtered.filter(order => {
        const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return orderTotal <= parseFloat(filters.priceMax);
      });
    }

    // Filtrage par date
    if (filters.dateFrom) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) <= new Date(filters.dateTo)
      );
    }

    // Tri
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price_high':
        filtered.sort((a, b) => {
          const totalA = a.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const totalB = b.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return totalB - totalA;
        });
        break;
      case 'price_low':
        filtered.sort((a, b) => {
          const totalA = a.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const totalB = b.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return totalA - totalB;
        });
        break;
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      sortBy: 'newest',
      priceMin: '',
      priceMax: '',
      dateFrom: '',
      dateTo: '',
      status: 'all'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-6">
        <BackgroundEffects />
        <div className="ios-container relative z-20">
          <div className="dashboard-card">
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-4 ios-body text-gray-900 dark:text-white">Chargement des commandes...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl md:text-5xl mb-4">
              Gestion des Commandes
            </h1>
            <p className="ios-body text-lg">
              Visualisez et analysez toutes les commandes de votre plateforme
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour Admin
          </Link>
        </div>

        {error && (
          <div className="ios-glass-error rounded-2xl p-6 ios-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="ios-grid-4 ios-slide-up">
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{stats.totalOrders}</div>
            <div className="dashboard-stat-label">Total Commandes</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{formatPrice(stats.totalRevenue)}</div>
            <div className="dashboard-stat-label">Chiffre d'Affaires</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{formatPrice(stats.averageOrderValue)}</div>
            <div className="dashboard-stat-label">Panier Moyen</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{stats.uniqueCustomers}</div>
            <div className="dashboard-stat-label">Clients Uniques</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.1s'}}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            Filtres & Recherche
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <label className="ios-label">Rechercher un client</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="ios-input"
                placeholder="Nom ou email..."
              />
            </div>

            {/* Tri */}
            <div className="space-y-2">
              <label className="ios-label">Trier par</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="ios-input"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="price_high">Prix décroissant</option>
                <option value="price_low">Prix croissant</option>
              </select>
            </div>

            {/* Prix min */}
            <div className="space-y-2">
              <label className="ios-label">Prix minimum</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="ios-input"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            {/* Prix max */}
            <div className="space-y-2">
              <label className="ios-label">Prix maximum</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="ios-input"
                placeholder="999.99"
                step="0.01"
              />
            </div>

            {/* Date début */}
            <div className="space-y-2">
              <label className="ios-label">Date de début</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="ios-input"
              />
            </div>

            {/* Date fin */}
            <div className="space-y-2">
              <label className="ios-label">Date de fin</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="ios-input"
              />
            </div>

            {/* Bouton reset */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="ios-button-secondary w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            </div>

            {/* Résultats */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{filteredOrders.length}</strong> commande(s) trouvée(s)
              </div>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              Toutes les Commandes
            </h2>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="ios-body text-gray-500 dark:text-gray-400">
                Aucune commande trouvée avec ces critères.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                
                return (
                  <div key={order.id} className="ios-glass-light rounded-2xl p-6 hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          {order.user?.image ? (
                            <Image 
                              src={order.user.image}
                              alt={order.user.name || order.user.email}
                              className="w-full h-full object-cover"
                              fill
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {(order.user?.name || order.user?.email || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-gray-900 dark:text-white font-semibold">
                            {order.user?.name || order.user?.email || 'Utilisateur inconnu'}
                          </h3>
                          <p className="text-gray-600 dark:text-white/60 text-sm">
                            {order.user?.email}
                          </p>
                          <p className="text-gray-500 dark:text-white/50 text-xs">
                            Commande #{order.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(orderTotal)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {totalItems} article(s)
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Articles de la commande */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Articles commandés :
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {item.articleTitle?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.articleTitle || 'Article supprimé'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.quantity}x {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 