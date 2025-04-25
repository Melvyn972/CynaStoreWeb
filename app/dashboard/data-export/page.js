"use client";

import { useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default function DataExportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [exportType, setExportType] = useState("json");

  const handleExport = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/export-data", {
        method: "GET",
      });
      
      console.log(response);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      const data = await response.json();
      console.log("Data received:", data);
      
      if (exportType === "json") {
        // Create a downloadable JSON file with the user data
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mes-donnees.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportType === "pdf") {
        // Create PDF with user data
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text("Mes Données Personnelles", 14, 22);
        
        // Add date
        doc.setFontSize(11);
        const exportDate = data.dataExportDate ? new Date(data.dataExportDate).toLocaleDateString() : new Date().toLocaleDateString();
        doc.text(`Exporté le: ${exportDate}`, 14, 30);
        
        // Add personal information section
        doc.setFontSize(14);
        doc.text("Informations personnelles", 14, 40);
        
        // User info table from personalInformation
        const personalInfo = data.personalInformation || {};
        const userInfo = [
          ["ID", personalInfo.id || "-"],
          ["Nom", personalInfo.name || "-"],
          ["Email", personalInfo.email || "-"],
          ["Téléphone", personalInfo.phone || "-"],
          ["Adresse", personalInfo.address || "-"],
          ["Image de profil", personalInfo.profileImage ? "Oui" : "Non"],
          ["Compte créé le", personalInfo.accountCreated ? new Date(personalInfo.accountCreated).toLocaleDateString() : "-"],
          ["Dernière mise à jour", personalInfo.lastUpdated ? new Date(personalInfo.lastUpdated).toLocaleDateString() : "-"],
          ["Rôle", personalInfo.role || "-"]
        ];
        
        autoTable(doc, {
          startY: 45,
          head: [["Champ", "Valeur"]],
          body: userInfo,
          headStyles: { fillColor: [66, 139, 202] },
        });
        
        let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 45;
        
        // Add purchase history if available
        if (data.purchases && data.purchases.length > 0) {
          doc.text("Historique d'achats", 14, finalY + 15);
          
          const purchaseData = data.purchases.map(p => [
            p.id || "-",
            p.date ? new Date(p.date).toLocaleDateString() : "-",
            p.amount ? `${p.amount}€` : "-",
            p.status || "-"
          ]);
          
          autoTable(doc, {
            startY: finalY + 20,
            head: [["ID", "Date", "Montant", "Statut"]],
            body: purchaseData.length > 0 ? purchaseData : [["Aucun achat", "-", "-", "-"]],
            headStyles: { fillColor: [66, 139, 202] },
          });
          
          finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY;
        } else {
          doc.text("Historique d'achats", 14, finalY + 15);
          
          autoTable(doc, {
            startY: finalY + 20,
            head: [["Information"]],
            body: [["Aucun achat trouvé"]],
            headStyles: { fillColor: [66, 139, 202] },
          });
          
          finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY;
        }
        
        // Add export date
        doc.setFontSize(10);
        doc.text(`Document généré le ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
        
        // Save PDF
        doc.save("mes-donnees.pdf");
      }
      
      setSuccess(`Vos données ont été exportées avec succès au format ${exportType.toUpperCase()}`);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de l'exportation des données");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Exporter mes données</h1>
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
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Conformément au Règlement Général de Protection des Données (RGPD), 
                    vous pouvez télécharger une copie de toutes vos données personnelles 
                    que nous conservons.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Le fichier exporté contiendra :</h3>
                
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Vos informations personnelles
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Votre historique d&apos;achats
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Vos préférences et paramétrages
                  </li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 dark:text-white mb-3">Format d&apos;export :</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="exportType"
                      value="json"
                      checked={exportType === "json"}
                      onChange={() => setExportType("json")}
                      className="radio radio-primary mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">JSON</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="exportType"
                      value="pdf"
                      checked={exportType === "pdf"}
                      onChange={() => setExportType("pdf")}
                      className="radio radio-primary mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">PDF</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleExport}
                disabled={isLoading}
                className={`w-full mt-6 btn btn-primary normal-case text-white flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
                    Chargement...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger mes données ({exportType.toUpperCase()})
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 