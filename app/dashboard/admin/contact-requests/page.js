'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, [filter, currentPage]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (filter !== 'all') {
        params.append('isRead', filter === 'read' ? 'true' : 'false');
      }

      const response = await fetch(`/api/admin/contact-requests?${params}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des demandes');
      }

      const data = await response.json();
      setRequests(data.contactRequests);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/contact-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Mettre à jour la liste
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, isRead: !currentStatus } : req
      ));

      // Mettre à jour les stats
      setStats(prev => ({
        ...prev,
        read: currentStatus ? prev.read - 1 : prev.read + 1,
        unread: currentStatus ? prev.unread + 1 : prev.unread - 1
      }));

    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contact-requests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour la liste
      setRequests(prev => prev.filter(req => req.id !== id));
      
      // Mettre à jour les stats
      const deletedRequest = requests.find(r => r.id === id);
      if (deletedRequest) {
        setStats(prev => ({
          total: prev.total - 1,
          read: deletedRequest.isRead ? prev.read - 1 : prev.read,
          unread: deletedRequest.isRead ? prev.unread : prev.unread - 1
        }));
      }

    } catch (err) {
      alert('Erreur: ' + err.message);
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

  const getSubjectLabel = (subject) => {
    const subjects = {
      'question-generale': 'Question générale',
      'support-technique': 'Support technique',
      'information-produit': 'Information produit',
      'partenariat': 'Partenariat',
      'facturation': 'Facturation',
      'reclamation': 'Réclamation',
      'autre': 'Autre'
    };
    return subjects[subject] || subject;
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6">
      <BackgroundEffects />
      <div className="ios-container space-y-8 relative z-20">
        
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div>
            <h1 className="ios-title text-4xl mb-2">
              Demandes de <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">contact</span>
            </h1>
            <p className="ios-body">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>
          <Link 
            href="/dashboard/admin" 
            className="ios-button-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>

        {/* Statistiques */}
        <div className="ios-grid-3 ios-slide-up">
          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{stats.total}</div>
            <div className="dashboard-stat-label">Total</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{stats.unread}</div>
            <div className="dashboard-stat-label">Non lues</div>
          </div>

          <div className="dashboard-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="dashboard-stat-value text-4xl mb-2">{stats.read}</div>
            <div className="dashboard-stat-label">Lues</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="dashboard-card ios-slide-up">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Filtrer :</span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Toutes' },
                { key: 'unread', label: 'Non lues' },
                { key: 'read', label: 'Lues' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(key);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === key
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-white/70 hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        {loading ? (
          <div className="dashboard-card flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="dashboard-card text-center py-16">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune demande</h3>
            <p className="ios-body">
              {filter === 'all' ? 'Aucune demande de contact reçue.' : `Aucune demande ${filter === 'read' ? 'lue' : 'non lue'}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4 ios-slide-up">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`dashboard-card border-l-4 ${
                  request.isRead ? 'border-l-green-500' : 'border-l-orange-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.isRead 
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {request.isRead ? 'Lu' : 'Non lu'}
                      </span>
                      {request.subject && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {getSubjectLabel(request.subject)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {request.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-white/80 whitespace-pre-wrap">{request.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleReadStatus(request.id, request.isRead)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        request.isRead
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {request.isRead ? 'Marquer non lu' : 'Marquer lu'}
                    </button>
                    
                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="dashboard-card">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="ios-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span className="text-white px-4 py-2">
                    {currentPage} / {totalPages}
                  </span>
                  
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
