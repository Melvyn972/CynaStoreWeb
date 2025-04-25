import ButtonAccount from "@/components/ButtonAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import prisma from "@/libs/prisma";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const purchases = await prisma.purchase.findMany({
    where: {
      userId: user.id,
    },
    include: {
      article: true,
    },
  });

  // Group purchases by article
  const groupedPurchases = purchases.reduce((acc, purchase) => {
    const articleId = purchase.article?.id;
    
    if (!articleId) return acc;
    
    if (!acc[articleId]) {
      acc[articleId] = {
        article: purchase.article,
        totalQuantity: purchase.quantity,
        purchases: [purchase],
        latestPurchaseDate: purchase.purchaseDate
      };
    } else {
      acc[articleId].totalQuantity += purchase.quantity;
      acc[articleId].purchases.push(purchase);
      
      // Keep track of the most recent purchase date
      if (new Date(purchase.purchaseDate) > new Date(acc[articleId].latestPurchaseDate)) {
        acc[articleId].latestPurchaseDate = purchase.purchaseDate;
      }
    }
    
    return acc;
  }, {});

  const articlesArray = Object.values(groupedPurchases);

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <section className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">Tableau de bord</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonAccount />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informations personnelles
              </h2>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-24">Nom:</span> 
                  <span className="text-gray-800 dark:text-white">{user.name || "Non défini"}</span>
                </div>
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-24">Email:</span> 
                  <span className="text-gray-800 dark:text-white">{user.email}</span>
                </div>
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-24">Téléphone:</span> 
                  <span className="text-gray-800 dark:text-white">{user.phone || "Non défini"}</span>
                </div>
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-24">Rôle:</span> 
                  <span className="text-gray-800 dark:text-white">{user.role}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  href="/dashboard/profile" 
                  className="btn btn-primary text-white normal-case"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Modifier mon profil
                </Link>
              </div>
            </div>
          </div>

          {/* Admin Panel */}
          {user.role === "ADMIN" && (
            <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
              <div className="card-body p-6">
                <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  Administration
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Accédez au panneau d&apos;administration pour gérer les utilisateurs et les paramètres du site.</p>
                <Link 
                  href="/dashboard/admin" 
                  className="btn btn-secondary text-white normal-case"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Panneau d&apos;administration
                </Link>
              </div>
            </div>
          )}
        </div>

        <div id="articles">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4">
            Mes articles achetés
          </h2>
          {purchases.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Vous n&apos;avez pas encore acheté d&apos;articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articlesArray.map((item) => (
                <div key={item.article.id} className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl">
                  <div className="card-body p-6">
                    <div className="flex justify-between">
                      <h3 className="card-title text-lg font-bold text-gray-800 dark:text-white mb-2">{item.article.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        Quantité: {item.totalQuantity}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{item.article.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Prix unitaire: {item.article.price} €
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Dernier achat: {new Date(item.latestPurchaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    {item.purchases.length > 1 && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <p>Acheté {item.purchases.length} fois</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <Link href={`/articles/${item.article.id}`} className="btn btn-primary text-white normal-case">  
                        Voir l&apos;article
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* RGPD et paramètres */}
        <div className="card mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Paramètres RGPD et confidentialité
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/dashboard/rgpd" 
                className="flex items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-medium">Gérer mes consentements</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-200">Contrôlez vos préférences de confidentialité</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/rgpd?tab=historique" 
                className="flex items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-medium">Historique des consentements</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-200">Consultez l&apos;historique de vos choix</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/rgpd?tab=conservation" 
                className="flex items-center p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <div>
                  <h3 className="font-medium">Conservation des données</h3>
                  <p className="text-sm text-teal-600 dark:text-teal-200">Durée de conservation de vos données</p>
                </div>
              </Link>
              
              <Link 
                href="/dashboard/data-export" 
                className="flex items-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <div>
                  <h3 className="font-medium">Exporter mes données</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-200">Téléchargez vos données personnelles</p>
                </div>
              </Link>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <Link 
                href="/dashboard/delete-account" 
                className="flex items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div>
                  <h3 className="font-medium">Supprimer mon compte</h3>
                  <p className="text-sm text-red-500 dark:text-red-200">Cette action est irréversible</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Liens légaux */}
        <div className="mt-10 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/tos" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
