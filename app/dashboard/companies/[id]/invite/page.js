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

      toast.success("Invitation envoyée avec succès");
      setFormData({ email: "", role: "MEMBER" });

    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error(error.message || "Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
            Inviter des membres
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="nom@exemple.com"
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Un email d&apos;invitation sera envoyé à cette adresse
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="role">
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="MEMBER">Membre</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="bg-base-200 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Autorisations des rôles</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Membre:</span> Peut seulement voir les achats de l&apos;entreprise
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Administrateur:</span> Peut effectuer des achats pour l&apos;entreprise et voir les achats
                  </p>
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Propriétaire:</span> Peut tout faire, y compris supprimer l&apos;entreprise et gérer les membres
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Link
                href={`/dashboard/companies/${companyId}`}
                className="btn btn-outline normal-case"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </Link>
              <button
                type="submit"
                className="btn btn-primary text-white normal-case"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Envoyer l&apos;invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}