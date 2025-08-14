"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BackgroundEffects from "@/app/components/BackgroundEffects";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    phone: session?.user?.phone || "",
    address: session?.user?.address || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Email change state
  const [emailChangeData, setEmailChangeData] = useState({
    newEmail: "",
    confirmEmail: "",
  });
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState("");
  const [emailChangeSuccess, setEmailChangeSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailChangeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChangeSubmit = async (e) => {
    e.preventDefault();
    setEmailChangeLoading(true);
    setEmailChangeError("");
    setEmailChangeSuccess("");

    // Validation
    if (!emailChangeData.newEmail || !emailChangeData.confirmEmail) {
      setEmailChangeError("Veuillez remplir tous les champs");
      setEmailChangeLoading(false);
      return;
    }

    if (emailChangeData.newEmail !== emailChangeData.confirmEmail) {
      setEmailChangeError("Les adresses email ne correspondent pas");
      setEmailChangeLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/email-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: emailChangeData.newEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setEmailChangeSuccess(data.message);
      setEmailChangeData({ newEmail: "", confirmEmail: "" });
      
      // Afficher les infos de dev si disponibles
      if (data.devInfo) {
        console.log("=== DEV INFO ===");
        console.log("Token:", data.devInfo.token);
        console.log("URL:", data.devInfo.confirmationUrl);
        console.log("================");
      }
      
    } catch (err) {
      console.error(err);
      setEmailChangeError(err.message || "Une erreur est survenue");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
      });

      setSuccess("Profil mis à jour avec succès");
      
      // Refresh the page data
      router.refresh();
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden p-4 md:p-8 pb-24">
      <BackgroundEffects />
      <section className="max-w-3xl mx-auto relative z-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="ios-title text-3xl md:text-4xl">Modifier mon profil</h1>
          <Link 
            href="/dashboard" 
            className="ios-button-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
        </div>
        
        <div className="dashboard-card ios-slide-up">
          <div className="p-6">
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informations personnelles</h2>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 dark:text-gray-300 font-medium">Nom complet</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 py-3 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 dark:text-gray-300 font-medium">Téléphone</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 py-3 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Votre numéro de téléphone"
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 dark:text-gray-300 font-medium">Adresse</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-10 py-3 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Votre adresse complète"
                  />
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full btn btn-primary text-white normal-case ${
                    isLoading ? "loading" : ""
                  }`}
                >
                  {isLoading ? "Chargement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Section de changement d'email */}
        <div className="dashboard-card ios-slide-up mt-8" style={{animationDelay: '0.2s'}}>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Changer d'adresse email</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Email actuel : <span className="font-medium">{session?.user?.email}</span>
                </p>
              </div>
            </div>

            {emailChangeError && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{emailChangeError}</span>
              </div>
            )}

            {emailChangeSuccess && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{emailChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleEmailChangeSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 dark:text-gray-300 font-medium">Nouvelle adresse email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="newEmail"
                    value={emailChangeData.newEmail}
                    onChange={handleEmailChange}
                    className="input input-bordered w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="nouvelle@adresse.com"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 dark:text-gray-300 font-medium">Confirmer la nouvelle adresse</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={emailChangeData.confirmEmail}
                    onChange={handleEmailChange}
                    className="input input-bordered w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="confirmer@adresse.com"
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-300 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Important :</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      Un lien de confirmation sera envoyé à votre nouvelle adresse email. Vous devrez cliquer sur ce lien pour valider le changement. Vous serez ensuite déconnecté et devrez vous reconnecter avec votre nouvelle adresse.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={emailChangeLoading || !emailChangeData.newEmail || !emailChangeData.confirmEmail}
                  className={`w-full btn btn-secondary text-white normal-case ${
                    emailChangeLoading ? "loading" : ""
                  }`}
                >
                  {emailChangeLoading ? "Envoi en cours..." : "Demander le changement d'email"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </section>
    </main>
  );
} 