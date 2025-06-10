import Link from "next/link";

export default function CompanyPurchases({ purchases }) {
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
    <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-200 my-8">
      <div className="card-body p-6">
        <h2 className="card-title text-xl font-bold text-gray-800 dark:text-white mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Derniers achats de l&apos;entreprise
        </h2>

        {purchases.length === 0 ? (
          <div className="bg-base-200 dark:bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Aucun achat n&apos;a encore été effectué par cette entreprise.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articlesArray.map((item) => (
              <div key={item.article.id} className="card bg-base-200 dark:bg-gray-700 shadow-md">
                <div className="card-body p-4">
                  <div className="flex justify-between">
                    <h3 className="card-title text-base font-bold text-gray-800 dark:text-white">{item.article.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      Quantité: {item.totalQuantity}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">{item.article.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Prix unitaire: {item.article.price} €
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dernier achat: {new Date(item.latestPurchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                  {item.purchases.length > 1 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <p>Acheté {item.purchases.length} fois</p>
                    </div>
                  )}
                  <div className="mt-3">
                    <Link href={`/articles/${item.article.id}`} className="btn btn-primary btn-sm text-white normal-case">  
                      Voir l&apos;article
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="mt-4 text-right">
            <Link href="#" className="btn btn-outline btn-sm normal-case">
              Voir tous les achats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 