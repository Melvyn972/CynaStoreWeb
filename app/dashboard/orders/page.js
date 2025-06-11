'use client';

import { useState, useEffect } from 'react';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                Historique de vos achats
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
              <div className="dashboard-stat-value">{stats.totalOrders}</div>
              <div className="dashboard-stat-label">Total commandes</div>
            </div>
            
            <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="dashboard-stat-value">{stats.totalSpent.toFixed(2)} €</div>
              <div className="dashboard-stat-label">Total dépensé</div>
            </div>
            
            <div className="dashboard-card text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="dashboard-stat-value">{stats.totalItems}</div>
              <div className="dashboard-stat-label">Articles achetés</div>
            </div>
          </div>

          {/* Contenu principal */}
          {loading ? (
            <div className="dashboard-card text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Chargement de vos commandes...</p>
            </div>
          ) : error ? (
            <div className="dashboard-card text-center">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchOrders}
                className="ios-button-primary"
              >
                Réessayer
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="dashboard-card text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Aucune commande</h3>
              <p className="text-lg mb-6">Vous n'avez pas encore passé de commande.</p>
              <Link href="/" className="ios-button-primary">
                Découvrir les articles
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={index} className="dashboard-card ios-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        Commande du {formatDate(order.date)}
                      </h3>
                      <p className="text-black/60 dark:text-white/60">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {order.total.toFixed(2)} €
                      </div>
                      <div className="text-sm text-black/60 dark:text-white/60">
                        {order.totalQuantity} article{order.totalQuantity > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4 p-4 ios-glass-light rounded-2xl">
                        {item.article.image && (
                          <img 
                            src={item.article.image} 
                            alt={item.article.title}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{item.article.title}</h4>
                          <p className="text-black/60 dark:text-white/60">
                            {item.article.price.toFixed(2)} € × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {(item.article.price * item.quantity).toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 