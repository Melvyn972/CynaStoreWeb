'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import BackgroundEffects from '@/app/components/BackgroundEffects';

export default function UserOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalItems: 0
  });

  // Nouveaux états pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/orders');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      
      const data = await response.json();
      setOrders(data.orders);
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage et tri des commandes
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.articles?.some(article => 
          article.title?.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.stripeSessionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => {
        const status = getOrderStatus(order);
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.purchaseDate);
          bValue = new Date(b.purchaseDate);
          break;
        case 'amount':
          aValue = calculateOrderTotal(a);
          bValue = calculateOrderTotal(b);
          break;
        case 'quantity':
          aValue = a.articles?.reduce((sum, article) => sum + (article.quantity || 1), 0) || 0;
          bValue = b.articles?.reduce((sum, article) => sum + (article.quantity || 1), 0) || 0;
          break;
        case 'status':
          aValue = getOrderStatus(a);
          bValue = getOrderStatus(b);
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, searchTerm, sortBy, sortOrder, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOrderTotal = (order) => {
    if (!order.articles) return 0;
    return order.articles.reduce((total, article) => {
      return total + (article.price * (article.quantity || 1));
    }, 0);
  };

  const getOrderStatus = (order) => {
    // Logique pour déterminer le statut de la commande
    const now = new Date();
    const orderDate = new Date(order.purchaseDate);
    const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    if (daysSinceOrder < 1) return 'En cours';
    if (daysSinceOrder < 3) return 'Expédiée';
    return 'Livrée';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'expédiée': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'livrée': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const maskSensitiveData = (data) => {
    if (!data) return '';
    const visible = Math.min(4, Math.floor(data.length * 0.3));
    return data.substring(0, visible) + '*'.repeat(Math.max(0, data.length - visible));
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Vous devez être connecté pour voir vos commandes</p>
          <Link href="/auth/signin" className="ios-button-primary">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-20 pt-24 pb-20">
        <div className="ios-container px-6 md:px-10 mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 ios-fade-in">
            <div>
              <h1 className="ios-title mb-4">
                Mes <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">commandes</span>
              </h1>
              <p className="ios-body text-lg">
                Historique et suivi de vos achats
              </p>
            </div>
            
            <Link 
              href="/dashboard" 
              className="ios-button-secondary flex items-center gap-2 mt-6 md:mt-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au tableau de bord
            </Link>
          </div>

          {/* Statistiques */}
          <div className="ios-grid-3 mb-12 ios-slide-up">
            <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="dashboard-stat-value text-4xl mb-2">{stats.totalOrders}</div>
              <div className="dashboard-stat-label">Commandes</div>
            </div>
            
            <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="dashboard-stat-value text-4xl mb-2">{stats.totalSpent.toFixed(2)} €</div>
              <div className="dashboard-stat-label">Total dépensé</div>
            </div>
            
            <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="dashboard-stat-value text-4xl mb-2">{stats.totalItems}</div>
              <div className="dashboard-stat-label">Articles achetés</div>
            </div>
          </div>

          {/* Gestion d'erreur */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 mb-8 ios-slide-up">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* État de chargement */}
          {loading ? (
            <div className="dashboard-card flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Filtres et recherche */}
              {orders.length > 0 && (
                <div className="dashboard-card ios-slide-up mb-8">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                      Filtres et recherche
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Recherche */}
                      <div className="space-y-2">
                        <label className="ios-label">Rechercher</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ios-input pl-10"
                            placeholder="ID commande, produit..."
                          />
                          <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Filtre par statut */}
                      <div className="space-y-2">
                        <label className="ios-label">Statut</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="ios-input"
                        >
                          <option value="all">Tous les statuts</option>
                          <option value="en cours">En cours</option>
                          <option value="expédiée">Expédiée</option>
                          <option value="livrée">Livrée</option>
                        </select>
                      </div>

                      {/* Tri */}
                      <div className="space-y-2">
                        <label className="ios-label">Trier par</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="ios-input"
                        >
                          <option value="date">Date</option>
                          <option value="amount">Montant</option>
                          <option value="quantity">Quantité</option>
                          <option value="status">Statut</option>
                        </select>
                      </div>

                      {/* Ordre */}
                      <div className="space-y-2">
                        <label className="ios-label">Ordre</label>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="ios-input"
                        >
                          <option value="desc">Décroissant</option>
                          <option value="asc">Croissant</option>
                        </select>
                      </div>
                    </div>

                    {/* Résultats */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        {filteredAndSortedOrders.length} commande{filteredAndSortedOrders.length > 1 ? 's' : ''} 
                        {searchTerm && ` trouvée${filteredAndSortedOrders.length > 1 ? 's' : ''}`}
                      </span>
                      {(searchTerm || statusFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setCurrentPage(1);
                          }}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tableau des commandes */}
              {filteredAndSortedOrders.length > 0 ? (
                <>
                  <div className="dashboard-card ios-slide-up">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-4 px-4 text-white/60 font-medium">Date</th>
                            <th className="text-left py-4 px-4 text-white/60 font-medium">ID</th>
                            <th className="text-left py-4 px-4 text-white/60 font-medium">Articles</th>
                            <th className="text-left py-4 px-4 text-white/60 font-medium">Quantité</th>
                            <th className="text-left py-4 px-4 text-white/60 font-medium">Total</th>
                            <th className="text-left py-4 px-4 text-white/60 font-medium">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.map((order, index) => {
                            const total = calculateOrderTotal(order);
                            const status = getOrderStatus(order);
                            const totalQuantity = order.articles?.reduce((sum, article) => sum + (article.quantity || 1), 0) || 0;
                            
                            return (
                              <tr key={order.id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="text-white font-medium">
                                    {formatDate(order.purchaseDate)}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-xs font-mono text-white/60">
                                    {maskSensitiveData(order.id)}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="space-y-1">
                                    {order.articles?.map((article, articleIndex) => (
                                      <div key={articleIndex} className="text-sm">
                                        <span className="text-white">{article.title}</span>
                                        <span className="text-white/60 ml-2">
                                          ({article.quantity}x)
                                        </span>
                                      </div>
                                    )) || (
                                      <span className="text-white/60">Aucun article</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-white font-medium">
                                    {totalQuantity}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="text-white font-semibold">
                                    {total.toFixed(2)} €
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                    {status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="dashboard-card mt-6">
                      <div className="flex items-center justify-between p-4">
                        <div className="text-sm text-white/60">
                          Page {currentPage} sur {totalPages} ({filteredAndSortedOrders.length} commandes)
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="ios-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="ios-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : orders.length > 0 ? (
                <div className="dashboard-card text-center py-16 ios-slide-up">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun résultat</h3>
                  <p className="ios-body mb-6">
                    Aucune commande ne correspond à vos critères de recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setCurrentPage(1);
                    }}
                    className="ios-button-secondary"
                  >
                    Afficher toutes les commandes
                  </button>
                </div>
              ) : (
                <div className="dashboard-card text-center py-16 ios-slide-up">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucune commande</h3>
                  <p className="ios-body mb-6">
                    Vous n'avez encore passé aucune commande.
                  </p>
                  <Link href="/articles" className="ios-button-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Découvrir nos produits
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}