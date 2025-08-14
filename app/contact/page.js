'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import BackgroundEffects from "@/app/components/BackgroundEffects";
import Footer from "@/components/Footer";
import DynamicContent from "@/components/DynamicContent";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSuccess(data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden py-24">
        <BackgroundEffects />

        <div className="relative z-20 max-w-5xl w-full mx-auto dashboard-card overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex flex-col justify-center text-left">
            <h1 className="ios-title text-4xl mb-4">
              Vous avez un besoin ou une question ?
            </h1>
            <p className="ios-body text-xl mb-6">
              Contactez-nous, nous vous répondrons rapidement.
            </p>
            <div className="space-y-2 text-black dark:text-white">
              <p className="font-semibold">Adresse :</p>
              <p className="text-black/80 dark:text-white/80">10 rue de Penthièvre, 75008 Paris</p>
              <p className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline">
                +33 1 89 70 14 36
              </p>
              <p className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline">
                contact@cyna-it.fr
              </p>
            </div>
          </div>

          <div className="md:w-1/2 p-8 ios-glass-light">
            
            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="ios-label">
                  Nom *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="ios-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ios-input"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="ios-label">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="ios-input"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question-generale">Question générale</option>
                  <option value="support-technique">Support technique</option>
                  <option value="information-produit">Information produit</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="facturation">Facturation</option>
                  <option value="reclamation">Réclamation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="ios-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="ios-input h-32 resize-none"
                  placeholder="Décrivez votre demande..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`ios-button-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="relative z-20 mt-8 text-center">
          <Link href="/" className="ios-button-secondary">
            ← Retour à l'accueil
          </Link>
        </div>
        
        <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mx-4 my-8"></div>}>
          <DynamicContent pageLocation="contact" />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}