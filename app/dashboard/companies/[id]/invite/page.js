"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ButtonAccount from "@/components/ButtonAccount";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function InviteMemberPage({ params }) {
  const router = useRouter();
  const companyId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "MEMBER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.email.trim()) {
        toast.error("L'adresse email est requise");
        return;
      }

      const response = await fetch("/api/companies/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId,
          email: formData.email,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'envoi de l'invitation");
      }

      const data = await response.json();
      toast.success(data.message || "Invitation envoyée avec succès");
      setFormData({ email: "", role: "MEMBER" });

    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error(error.message || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="ios-container space-y-8">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between ios-fade-in">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/companies/${companyId}`}
              className="ios-button-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
            <div>
              <h1 className="ios-title text-3xl md:text-4xl mb-2">
                Inviter des membres
              </h1>
              <p className="ios-body">
                Ajoutez de nouveaux membres à votre entreprise
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>

        {/* Formulaire d'invitation */}
        <div className="dashboard-card ios-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Inviter un membre existant</h2>
              <p className="ios-body">Invitez un utilisateur qui a déjà un compte CynaStore à rejoindre votre entreprise</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Notification importante */}
            <div className="ios-glass-light rounded-2xl p-6 border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Nouveau fonctionnement des invitations</h4>
                  <p className="text-white/80 text-sm">
                    Les invitations n'envoient plus d'emails automatiques. L'utilisateur invité verra l'invitation directement dans son tableau de bord et pourra l'accepter ou la refuser en un clic.
                  </p>
                </div>
              </div>
            </div>

            {/* Informations du membre */}
            <div className="ios-glass-light rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations du membre
              </h3>
              
              <div>
                <label className="ios-label" htmlFor="email">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="nom@exemple.com"
                  required
                />
                <p className="mt-2 text-white/60 text-sm">
                  ⚠️ <strong>Important :</strong> L'utilisateur doit déjà avoir un compte sur CynaStore pour pouvoir être invité. L'invitation apparaîtra dans son tableau de bord.
                </p>
              </div>

              <div>
                <label className="ios-label" htmlFor="role">
                  Rôle dans l&apos;entreprise
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="ios-input"
                >
                  <option value="MEMBER">Membre</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            {/* Explication des rôles */}
            <div className="ios-glass-light rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Autorisations des rôles
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium mb-1">Membre</p>
                    <p className="text-white/70 text-sm">Peut seulement consulter les achats de l&apos;entreprise et les informations générales.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium mb-1">Administrateur</p>
                    <p className="text-white/70 text-sm">Peut effectuer des achats pour l&apos;entreprise, voir tous les achats et gérer les membres.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-medium mb-1">Propriétaire</p>
                    <p className="text-white/70 text-sm">Contrôle total : peut supprimer l&apos;entreprise, gérer tous les membres et effectuer toutes les actions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
              <Link
                href={`/dashboard/companies/${companyId}`}
                className="ios-button-secondary text-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler
              </Link>
              
              <button
                type="submit"
                className="ios-button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Envoyer l&apos;invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}