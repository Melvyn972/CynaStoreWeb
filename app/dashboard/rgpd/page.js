"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
          setConsentSettings(data.consent);
          setDataRetentionPeriod(data.dataRetentionPeriod);
          setConsentHistory(data.history || []);
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

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Paramètres RGPD</h1>
          <Link 
            href="/dashboard" 
            className="btn btn-outline btn-sm normal-case dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="tabs tabs-boxed bg-white dark:bg-gray-800 p-1 rounded-xl">
            <Link
              href="/dashboard/rgpd"
              className={`tab ${
                activeTab === 'consentements'
                  ? 'tab-active bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Consentements
            </Link>
            <Link
              href="/dashboard/rgpd?tab=historique"
              className={`tab ${
                activeTab === 'historique'
                  ? 'tab-active bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historique
            </Link>
            <Link
              href="/dashboard/rgpd?tab=conservation"
              className={`tab ${
                activeTab === 'conservation'
                  ? 'tab-active bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Conservation
            </Link>
          </div>
        </div>
        
        <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200">
          <div className="card-body p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{success}</span>
              </div>
            )}
            
            {isLoading && activeTab !== 'consentements' ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Consentements tab */}
                {activeTab === 'consentements' && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Conformément au Règlement Général de Protection des Données (RGPD), 
                          vous pouvez contrôler comment vos données sont utilisées.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-body p-4">
                          <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                              </svg>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white">Communications marketing</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nous permet de vous envoyer des informations sur nos produits et services</p>
                              </div>
                            </div>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary"
                              checked={consentSettings.marketing}
                              onChange={() => handleToggleConsent('marketing')}
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-body p-4">
                          <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white">Analyses et statistiques</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nous permet d&apos;améliorer notre site en analysant votre usage</p>
                              </div>
                            </div>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary"
                              checked={consentSettings.analytics}
                              onChange={() => handleToggleConsent('analytics')}
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-body p-4">
                          <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-white">Partage avec des tiers</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nous permet de partager vos données avec nos partenaires</p>
                              </div>
                            </div>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary"
                              checked={consentSettings.thirdParty}
                              onChange={() => handleToggleConsent('thirdParty')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSaveConsent}
                      disabled={isLoading}
                      className={`btn btn-primary w-full mt-6 ${isLoading ? "loading" : ""}`}
                    >
                      {isLoading ? "Chargement..." : "Enregistrer mes préférences"}
                    </button>
                  </div>
                )}
                
                {/* Historique tab */}
                {activeTab === 'historique' && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Consultez l&apos;historique de vos choix de consentement et les modifications apportées à vos préférences.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {consentHistory.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                          <p className="text-gray-500 dark:text-gray-400">Aucun historique de consentement disponible</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                          {consentHistory.map((item, index) => (
                            <div key={index} className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                              <div className="card-body p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
                                      {formatConsentType(item.type)}
                                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                        item.status 
                                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                        }`}>
                                          {item.status ? 'Accepté' : 'Refusé'}
                                      </span>
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {formatTimestamp(item.timestamp)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      IP: {item.ip || "Inconnue"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Conservation tab */}
                {activeTab === 'conservation' && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-teal-100 dark:bg-teal-900/30 rounded-full p-3 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Choisissez la durée pendant laquelle nous conservons vos données personnelles.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-body p-4">
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start">
                              <input 
                                type="radio" 
                                name="retentionPeriod" 
                                className="radio radio-primary mr-3" 
                                checked={dataRetentionPeriod === '1_year'}
                                onChange={() => setDataRetentionPeriod('1_year')}
                              />
                              <div>
                                <span className="label-text font-medium text-gray-800 dark:text-white">1 an</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Vos données seront supprimées après 1 an d&apos;inactivité
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-body p-4">
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start">
                              <input 
                                type="radio" 
                                name="retentionPeriod" 
                                className="radio radio-primary mr-3" 
                                checked={dataRetentionPeriod === '2_years'}
                                onChange={() => setDataRetentionPeriod('2_years')}
                              />
                              <div>
                                <span className="label-text font-medium text-gray-800 dark:text-white">2 ans</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Vos données seront supprimées après 2 ans d&apos;inactivité
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card bg-gray-50 dark:bg-gray-700/50 shadow-sm rounded-lg overflow-hidden">
                        <div className="card-body p-4">
                          <div className="form-control">
                            <label className="label cursor-pointer justify-start">
                              <input 
                                type="radio" 
                                name="retentionPeriod" 
                                className="radio radio-primary mr-3" 
                                checked={dataRetentionPeriod === '3_years'}
                                onChange={() => setDataRetentionPeriod('3_years')}
                              />
                              <div>
                                <span className="label-text font-medium text-gray-800 dark:text-white">3 ans</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Vos données seront supprimées après 3 ans d&apos;inactivité
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSaveConsent}
                      disabled={isLoading}
                      className={`btn btn-primary w-full mt-6 ${isLoading ? "loading" : ""}`}
                    >
                      {isLoading ? "Chargement..." : "Enregistrer mes préférences"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 