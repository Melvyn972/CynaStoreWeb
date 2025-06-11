"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function InvitationActions({ invitation }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleInvitationAction = async (action) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/companies/invitations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId: invitation.id,
          action: action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du traitement de l'invitation");
      }

      toast.success(data.message);
      router.refresh(); // Actualiser la page pour refléter les changements
    } catch (error) {
      console.error("Error processing invitation:", error);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur";
      case "MEMBER":
        return "Membre";
      case "OWNER":
        return "Propriétaire";
      default:
        return role;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="ios-glass-light rounded-2xl p-6 hover:bg-white/20 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {invitation.company.name}
          </h3>
          <p className="ios-body text-sm mb-2">
            Vous êtes invité en tant que <span className="font-medium text-blue-400">{formatRole(invitation.role)}</span>
          </p>
          <p className="ios-body text-xs">
            Invitation reçue le {formatDate(invitation.createdAt)}
          </p>
          <p className="ios-body text-xs opacity-75">
            Expire le {formatDate(invitation.expiresAt)}
          </p>
        </div>
        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30 ml-3">
          En attente
        </span>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => handleInvitationAction("accept")}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-xl font-medium transition-all hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          Accepter
        </button>
        
        <button
          onClick={() => handleInvitationAction("decline")}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium transition-all hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          Refuser
        </button>
      </div>
    </div>
  );
} 