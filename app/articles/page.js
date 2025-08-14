'use client';
import { useState, useEffect } from "react";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";
import PageLayout from "@/components/PageLayout";
import ArticlesClient from "./ArticlesClient";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles?limit=50');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des articles');
        }
        
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen relative overflow-hidden">
          <div className="ios-container pt-24 pb-20 relative z-20">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="ml-4 text-white">Chargement des articles...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen relative overflow-hidden">
          <div className="ios-container pt-24 pb-20 relative z-20">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <p className="text-red-500 mb-4">Erreur: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <ArticlesClient articles={articles} />
    </PageLayout>
  );
};

export default ArticlesPage;

