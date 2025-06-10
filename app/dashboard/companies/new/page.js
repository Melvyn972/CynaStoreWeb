"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ButtonAccount from "@/components/ButtonAccount";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function NewCompanyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    vatNumber: "",
    siretNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        toast.error("Le nom de l'entreprise est requis");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur serveur");
      }

      const data = await response.json();
      toast.success("Entreprise créée avec succès");
      router.push(`/dashboard/companies/${data.id}`);
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error(error.message || "Erreur lors de la création de l'entreprise");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Nouvelle Entreprise</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                  Nom de l&apos;entreprise *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                  Email de l&apos;entreprise
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="address">
                  Adresse
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows={2}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="website">
                  Site web
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="https://"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="vatNumber">
                  Numéro TVA
                </label>
                <input
                  type="text"
                  id="vatNumber"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="siretNumber">
                  Numéro SIRET
                </label>
                <input
                  type="text"
                  id="siretNumber"
                  name="siretNumber"
                  value={formData.siretNumber}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Link
                href="/dashboard/companies"
                className="btn btn-outline normal-case"
              >
                Annuler
              </Link>
              <button
                type="submit"
                className="btn btn-primary text-white normal-case"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Création en cours...
                  </>
                ) : (
                  "Créer l'entreprise"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
} 