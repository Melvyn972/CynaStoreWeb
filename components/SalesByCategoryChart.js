'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SalesByCategoryChart = ({ orders }) => {
  // Calculer les ventes par catégorie
  const calculateSalesByCategory = () => {
    const categoryStats = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const categoryName = item.categoryName || 'Non catégorisé';
        const revenue = item.price * item.quantity;
        
        if (categoryStats[categoryName]) {
          categoryStats[categoryName].revenue += revenue;
          categoryStats[categoryName].quantity += item.quantity;
        } else {
          categoryStats[categoryName] = {
            revenue: revenue,
            quantity: item.quantity
          };
        }
      });
    });
    
    return categoryStats;
  };

  const categoryStats = calculateSalesByCategory();
  
  // Si pas de données, afficher un message
  if (Object.keys(categoryStats).length === 0) {
    return (
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Ventes par Catégorie
          </h2>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="ios-body text-gray-500 dark:text-gray-400">
            Aucune donnée de vente disponible pour le graphique.
          </p>
        </div>
      </div>
    );
  }

  // Préparer les données pour le graphique
  const categories = Object.keys(categoryStats);
  const revenues = categories.map(cat => categoryStats[cat].revenue);
  const quantities = categories.map(cat => categoryStats[cat].quantity);

  // Couleurs pour le graphique (palette harmonieuse)
  const colors = [
    '#3B82F6', // Bleu
    '#10B981', // Vert
    '#F59E0B', // Orange
    '#EF4444', // Rouge
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#F97316', // Orange foncé
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E', // Rose
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Chiffre d\'affaires (€)',
        data: revenues,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length).map(color => color + '80'),
        borderWidth: 2,
        hoverOffset: 10,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false
      },
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280',
          font: {
            size: 14
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const categoryName = context.label;
            const revenue = context.parsed;
            const quantity = quantities[context.dataIndex];
            const percentage = ((revenue / revenues.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            
            return [
              `${categoryName}`,
              `Chiffre d'affaires: ${revenue.toFixed(2)} €`,
              `Articles vendus: ${quantity}`,
              `Pourcentage: ${percentage}%`
            ];
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  // Formater les prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Calculer le total des revenus
  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue, 0);

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Ventes par Catégorie
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatPrice(totalRevenue)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique */}
        <div className="relative h-80">
          <Doughnut data={data} options={options} />
        </div>

        {/* Détails par catégorie */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Détail par catégorie
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {categories
              .map((category, index) => ({
                category,
                revenue: revenues[index],
                quantity: quantities[index],
                color: colors[index],
                percentage: (revenues[index] / totalRevenue * 100).toFixed(1)
              }))
              .sort((a, b) => b.revenue - a.revenue)
              .map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-4 ios-glass-light rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.category}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.quantity} article{item.quantity > 1 ? 's' : ''} vendu{item.quantity > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.revenue)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesByCategoryChart;
