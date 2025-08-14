"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function RGPDPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const [consentSettings, setConsentSettings] = useState({
    marketing: false,
    analytics: false,
    thirdParty: false,
  });
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState("2_years");
  const [consentHistory, setConsentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(
    tabParam === "historique" || tabParam === "conservation"
      ? tabParam
      : "consentements"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load current consent settings and history
  useEffect(() => {
    const loadConsentData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/consent");
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Données de consentement récupérées:', data);
          console.log('🔧 Consentements:', data.consent);
          setConsentSettings(data.consent);
          setDataRetentionPeriod(data.dataRetentionPeriod);
          setConsentHistory(data.history || []);
        } else {
          console.error('❌ Erreur lors de la récupération des consentements:', response.status);
        }
      } catch (err) {
        console.error("Error loading consent settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConsentData();
  }, []);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam === "historique" || tabParam === "conservation") {
      setActiveTab(tabParam);
    } else {
      setActiveTab("consentements");
    }
  }, [tabParam]);

  const handleToggleConsent = (key) => {
    setConsentSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveConsent = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/consent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          consent: consentSettings,
          dataRetentionPeriod
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Reload consent history
      const updatedData = await fetch("/api/user/consent").then(res => res.json());
      setConsentHistory(updatedData.history || []);
      
      setSuccess("Vos préférences de consentement ont été mises à jour");
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la mise à jour des préférences");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatConsentType = (type) => {
    switch(type) {
      case 'marketing': return 'Communications marketing';
      case 'analytics': return 'Analyses et statistiques';
      case 'thirdParty': return 'Partage avec des tiers';
      default: return type;
    }
  };

  const getRetentionLabel = (period) => {
    switch(period) {
      case '1_year': return 'Conservation 1 an';
      case '2_years': return 'Conservation 2 ans';
      case '3_years': return 'Conservation 3 ans';
      default: return 'Non défini';
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-20 pt-24 pb-20">
        <div className="ios-container px-6 md:px-10 mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 ios-fade-in">
            <div>
              <h1 className="ios-title mb-4">
                Paramètres <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">RGPD</span>
              </h1>
              <p className="ios-body text-lg">
                Gérez vos consentements et la conservation de vos données
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

          {/* Onglets */}
          <div className="flex flex-wrap gap-4 mb-8 ios-slide-up">
            <Link
              href="/dashboard/rgpd"
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                activeTab === 'consentements'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'ios-glass-light text-black/80 dark:text-white/80 hover:bg-green-500/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Consentements
              </div>
            </Link>
            
            <Link
              href="/dashboard/rgpd?tab=historique"
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                activeTab === 'historique'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'ios-glass-light text-black/80 dark:text-white/80 hover:bg-purple-500/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historique
              </div>
            </Link>
            
            <Link
              href="/dashboard/rgpd?tab=conservation"
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                activeTab === 'conservation'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'ios-glass-light text-black/80 dark:text-white/80 hover:bg-blue-500/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Conservation
              </div>
            </Link>
          </div>

          {/* Messages */}
          {error && (
            <div className="dashboard-card mb-8 border-2 border-red-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Erreur</h4>
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="dashboard-card mb-8 border-2 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Succès</h4>
                  <p className="text-green-600 dark:text-green-400">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className="dashboard-card ios-slide-up" style={{animationDelay: '0.1s'}}>
            {isLoading && activeTab !== 'consentements' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg">Chargement...</p>
              </div>
            ) : (
              <>
                {/* Onglet Consentements */}
                {activeTab === 'consentements' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Gestion des consentements</h3>
                        <p className="ios-body">
                          Conformément au Règlement Général de Protection des Données (RGPD), 
                          vous pouvez contrôler comment vos données sont utilisées. Votre période de conservation actuelle : 
                          <span className="font-semibold text-green-600 dark:text-green-400"> {getRetentionLabel(dataRetentionPeriod)}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 ios-glass-light rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-black dark:text-white">Communications marketing</h4>
                              <p className="ios-body text-sm">Nous permet de vous envoyer des informations sur nos produits et services</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleConsent('marketing')}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              consentSettings.marketing ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                consentSettings.marketing ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 ios-glass-light rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-black dark:text-white">Analyses et statistiques</h4>
                              <p className="ios-body text-sm">Nous permet d'améliorer notre site en analysant votre usage</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleConsent('analytics')}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              consentSettings.analytics ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                consentSettings.analytics ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 ios-glass-light rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-black dark:text-white">Partage avec des tiers</h4>
                              <p className="ios-body text-sm">Nous permet de partager vos données avec nos partenaires</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleConsent('thirdParty')}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              consentSettings.thirdParty ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                                consentSettings.thirdParty ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSaveConsent}
                      disabled={isLoading}
                      className="w-full ios-button-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Enregistrement...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Enregistrer mes préférences
                        </div>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Onglet Historique */}
                {activeTab === 'historique' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Historique des consentements</h3>
                        <p className="ios-body">
                          Consultez l'historique de vos choix de consentement et les modifications apportées à vos préférences.
                        </p>
                      </div>
                    </div>
                    
                    {consentHistory.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-black dark:text-white mb-4">Aucun historique</h4>
                        <p className="ios-body">Aucun historique de consentement disponible pour le moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {consentHistory.map((item, index) => (
                          <div key={index} className="p-6 ios-glass-light rounded-2xl border border-purple-500/20">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                  item.status 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                                }`}>
                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                      item.status ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"
                                    } />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-black dark:text-white">
                                    {formatConsentType(item.consentType)}
                                  </h4>
                                  <p className="ios-body text-sm mb-2">
                                    {formatTimestamp(item.timestamp)}
                                  </p>
                                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                    item.status 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  }`}>
                                    {item.status ? 'Consentement accordé' : 'Consentement retiré'}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right text-sm text-black/60 dark:text-white/60">
                                <div>IP: {item.ipAddress || "Inconnue"}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Onglet Conservation */}
                {activeTab === 'conservation' && (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Conservation des données</h3>
                        <p className="ios-body">
                          Choisissez la durée pendant laquelle nous conservons vos données personnelles.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-6 ios-glass-light rounded-2xl border border-blue-500/20">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            name="retentionPeriod" 
                            className="sr-only"
                            checked={dataRetentionPeriod === '1_year'}
                            onChange={() => setDataRetentionPeriod('1_year')}
                          />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                            dataRetentionPeriod === '1_year' 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {dataRetentionPeriod === '1_year' && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-black dark:text-white">1 an</h4>
                            <p className="ios-body text-sm">
                              Vos données seront supprimées après 1 an d'inactivité
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="p-6 ios-glass-light rounded-2xl border border-blue-500/20">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            name="retentionPeriod" 
                            className="sr-only"
                            checked={dataRetentionPeriod === '2_years'}
                            onChange={() => setDataRetentionPeriod('2_years')}
                          />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                            dataRetentionPeriod === '2_years' 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {dataRetentionPeriod === '2_years' && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-black dark:text-white">2 ans (recommandé)</h4>
                            <p className="ios-body text-sm">
                              Vos données seront supprimées après 2 ans d'inactivité
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="p-6 ios-glass-light rounded-2xl border border-blue-500/20">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="radio" 
                            name="retentionPeriod" 
                            className="sr-only"
                            checked={dataRetentionPeriod === '3_years'}
                            onChange={() => setDataRetentionPeriod('3_years')}
                          />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                            dataRetentionPeriod === '3_years' 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {dataRetentionPeriod === '3_years' && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-black dark:text-white">3 ans</h4>
                            <p className="ios-body text-sm">
                              Vos données seront supprimées après 3 ans d'inactivité
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSaveConsent}
                      disabled={isLoading}
                      className="w-full ios-button-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Enregistrement...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Enregistrer mes préférences
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 