"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function CompanyActions({company, isOwner, isAdmin, currentRole, pendingInvitations}) {
    const router = useRouter();

    // Can manage members if owner or admin
    const canManageMembers = isOwner || isAdmin;
    // Can buy if owner or admin (not simple members)
    const canBuy = isOwner || isAdmin;

    const handleDeleteCompany = async () => {
        try {
            const response = await fetch("/api/companies", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: company.id}),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Erreur lors de la suppression de l'entreprise");
            }

            toast.success("Entreprise supprimée avec succès");
            router.push("/dashboard/companies");
        } catch (error) {
            console.error("Error deleting company:", error);
            toast.error(error.message || "Erreur lors de la suppression de l'entreprise");
        }
    };

    const handleLeaveCompany = async () => {
        try {
            const response = await fetch(`/api/companies/${company.id}/leave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Erreur lors de la sortie de l'entreprise");
            }

            toast.success("Vous avez quitté l'entreprise avec succès");
            router.push("/dashboard/companies");
        } catch (error) {
            console.error("Error leaving company:", error);
            toast.error(error.message || "Erreur lors de la sortie de l'entreprise");
        }
    };

    return (
        <div className="dashboard-card ios-slide-up min-w-[240px] w-64 mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Actions
                </h2>
            </div>

            <div className="space-y-4">
                {/* Purchase button - only for OWNER and ADMIN */}
                {canBuy ? (
                    <Link
                        href={`/articles?company=${company.id}`}
                        className="ios-button-primary w-full flex items-center justify-center gap-3 px-4 py-3 text-base rounded-2xl shadow"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Acheter pour l&apos;entreprise
                    </Link>
                ) : (
                    <div className="relative group">
                        <button 
                            className="w-full bg-gray-600/50 text-gray-400 px-4 py-3 text-base rounded-2xl font-medium cursor-not-allowed flex items-center justify-center gap-3 border border-gray-600/30 shadow"
                            disabled
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            Acheter pour l&apos;entreprise
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </button>
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Seuls les propriétaires et administrateurs peuvent effectuer des achats
                        </div>
                    </div>
                )}

                {/* Invite members - for OWNER and ADMIN */}
                {canManageMembers && (
                    <Link
                        href={`/dashboard/companies/${company.id}/invite`}
                        className="ios-button-secondary w-full flex items-center justify-center gap-3 px-4 py-3 text-base rounded-2xl shadow relative"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                        </svg>
                        Inviter des membres
                        {pendingInvitations.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                {pendingInvitations.length}
                            </span>
                        )}
                    </Link>
                )}

                {/* Delete company - only OWNER */}
                {isOwner && (
                    <button
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 text-base rounded-2xl font-medium transition-all hover:from-red-600 hover:to-pink-600 flex items-center justify-center gap-3 shadow"
                        onClick={() => document.getElementById('delete-company-modal').showModal()}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Supprimer l&apos;entreprise
                    </button>
                )}

                {/* Leave company - for non-owners */}
                {!isOwner && (
                    <button
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 text-base rounded-2xl font-medium transition-all hover:from-red-600 hover:to-pink-600 flex items-center justify-center gap-3 shadow"
                        onClick={() => document.getElementById('leave-company-modal').showModal()}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Quitter l&apos;entreprise
                    </button>
                )}

                {/* Role indicator */}
                <div className="ios-glass-light rounded-2xl p-4 text-center">
                    <div className="text-sm text-white/60 mb-2">Votre rôle :</div>
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        currentRole === 'OWNER' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : currentRole === 'ADMIN' 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                        {currentRole === 'OWNER' ? '👑 Propriétaire' : currentRole === 'ADMIN' ? '🔧 Administrateur' : '👤 Membre'}
                    </span>
                </div>
            </div>

            {/* Delete Company Modal */}
            <dialog id="delete-company-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-gray-800 border border-gray-700">
                    <h3 className="font-bold text-lg text-white mb-4">Supprimer l&apos;entreprise</h3>
                    <p className="text-gray-300 mb-6">
                        Êtes-vous sûr de vouloir supprimer l&apos;entreprise <span className="font-semibold text-white">{company.name}</span> ? Cette action est irréversible.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <form method="dialog">
                            <button className="ios-button-secondary">Annuler</button>
                        </form>
                        <button
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all hover:from-red-600 hover:to-pink-600"
                            onClick={handleDeleteCompany}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Leave Company Modal */}
            <dialog id="leave-company-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-gray-800 border border-gray-700">
                    <h3 className="font-bold text-lg text-white mb-4">Quitter l&apos;entreprise</h3>
                    <p className="text-gray-300 mb-6">
                        Êtes-vous sûr de vouloir quitter l&apos;entreprise <span className="font-semibold text-white">{company.name}</span> ? Vous devrez être invité à nouveau pour la rejoindre.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <form method="dialog">
                            <button className="ios-button-secondary">Annuler</button>
                        </form>
                        <button
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all hover:from-red-600 hover:to-pink-600"
                            onClick={handleLeaveCompany}
                        >
                            Quitter
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}