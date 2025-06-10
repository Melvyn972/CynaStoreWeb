"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function CompanyActions({company, isOwner, pendingInvitations}) {
    const router = useRouter();

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
        <div
            className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200">
            <div className="card-body p-6">
                <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Actions
                </h2>

                <div className="space-y-3">
                    <Link
                        href={`/articles?company=${company.id}`}
                        className="btn btn-primary text-white normal-case w-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Acheter pour l&apos;entreprise
                    </Link>

                    {isOwner && (
                        <Link
                            href={`/dashboard/companies/${company.id}/invite`}
                            className="btn btn-secondary text-white normal-case w-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                            </svg>
                            Inviter des membres
                            {pendingInvitations.length > 0 && (
                                <div className="badge badge-accent ml-2">{pendingInvitations.length}</div>
                            )}
                        </Link>
                    )}

                    {isOwner && (
                        <button
                            className="btn btn-error text-white normal-case w-full"
                            onClick={() => document.getElementById('delete-company-modal').showModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Supprimer l&apos;entreprise
                        </button>
                    )}

                    {!isOwner && (
                        <button
                            className="btn btn-error text-white normal-case w-full"
                            onClick={() => document.getElementById('leave-company-modal').showModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Quitter l&apos;entreprise
                        </button>
                    )}
                </div>
            </div>

            {/* Delete Company Modal */}
            <dialog id="delete-company-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Supprimer l&apos;entreprise</h3>
                    <p className="py-4">
                        Êtes-vous sûr de vouloir supprimer l&apos;entreprise {company.name} ? Cette action est
                        irréversible.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-outline mr-2">Annuler</button>
                        </form>
                        <button
                            className="btn btn-error text-white"
                            onClick={handleDeleteCompany}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Leave Company Modal */}
            <dialog id="leave-company-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Quitter l&apos;entreprise</h3>
                    <p className="py-4">
                        Êtes-vous sûr de vouloir quitter l&apos;entreprise {company.name} ?
                        Vous devrez être invité à nouveau pour la rejoindre.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-outline mr-2">Annuler</button>
                        </form>
                        <button
                            className="btn btn-error text-white"
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