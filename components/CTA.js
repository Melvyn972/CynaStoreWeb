
const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-base-100 to-base-200 dark:bg-black py-24 lg:py-36">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-300/20 via-blue-300/20 to-transparent dark:from-purple-900/20 dark:to-blue-900/20 z-0"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-300/20 to-transparent dark:from-purple-500/10 dark:to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-300/20 to-transparent dark:from-blue-500/10 dark:to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block py-1 px-3 text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:bg-white/10 text-base-content dark:text-white rounded-full mb-6 font-medium">
            Commencez dès aujourd&apos;hui
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content dark:text-white mb-6 leading-tight">
            Protégez votre entreprise contre les <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400">menaces cyber</span> en évolution
            </h2>
          <p className="text-xl text-base-content/80 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Mettez en œuvre une sécurité de niveau entreprise sans la complexité ou le coût de niveau entreprise. Commencez à sécuriser vos actifs dès aujourd&apos;hui.
            </p>
        </div>
            
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
          <div className="relative group w-full md:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
            <button className="relative w-full md:w-auto px-8 py-4 bg-base-100 dark:bg-black text-base-content dark:text-white font-medium rounded-full flex items-center justify-center gap-2 group-hover:bg-base-100/95 dark:group-hover:bg-black/95 transition duration-200">
              <span>Programmer une démo</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              </button>
          </div>
          
          <a href="#" className="w-full md:w-auto px-8 py-4 bg-base-200/80 dark:bg-white/10 backdrop-blur-md hover:bg-base-300 dark:hover:bg-white/20 text-base-content dark:text-white transition-all rounded-full font-medium text-center">
            Commencer
          </a>
        </div>
        
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
          <div className="bg-gradient-to-br from-base-200 to-base-300/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg hover:from-base-100 hover:to-base-200 dark:hover:bg-white/10 transition-all duration-300 border border-base-300 dark:border-white/5">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 dark:bg-purple-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8L2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-base-content dark:text-white mb-1">Facile à utiliser</h3>
            <p className="text-base-content/70 dark:text-gray-400 text-sm">Interface intuitive conçue pour tous les niveaux</p>
          </div>
          
          <div className="bg-gradient-to-br from-base-200 to-base-300/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg hover:from-base-100 hover:to-base-200 dark:hover:bg-white/10 transition-all duration-300 border border-base-300 dark:border-white/5">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 dark:bg-blue-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-base-content dark:text-white mb-1">Alertes en temps réel</h3>
            <p className="text-base-content/70 dark:text-gray-400 text-sm">Soyez informé immédiatement de toute menace</p>
          </div>
          
          <div className="bg-gradient-to-br from-base-200 to-base-300/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg hover:from-base-100 hover:to-base-200 dark:hover:bg-white/10 transition-all duration-300 border border-base-300 dark:border-white/5">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 dark:bg-green-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11M5 11H19C20.1046 11 21 11.8954 21 13V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V13C3 11.8954 3.89543 11 5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-base-content dark:text-white mb-1">Sécurité renforcée</h3>
            <p className="text-base-content/70 dark:text-gray-400 text-sm">Protégez vos données avec le chiffrement avancé</p>
              </div>
          
          <div className="bg-gradient-to-br from-base-200 to-base-300/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg hover:from-base-100 hover:to-base-200 dark:hover:bg-white/10 transition-all duration-300 border border-base-300 dark:border-white/5">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 dark:bg-yellow-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 20.9999V18.9999C21.9993 18.1136 21.7044 17.2527 21.1614 16.5522C20.6184 15.8517 19.8581 15.3515 19 15.1299" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.12988C16.8604 3.35018 17.623 3.85058 18.1676 4.55219C18.7122 5.2538 19.0078 6.11671 19.0078 7.00488C19.0078 7.89305 18.7122 8.75596 18.1676 9.45757C17.623 10.1592 16.8604 10.6596 16 10.8799" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
            <h3 className="text-lg font-semibold text-base-content dark:text-white mb-1">Support 24/7</h3>
            <p className="text-base-content/70 dark:text-gray-400 text-sm">Une équipe d&apos;experts à votre service en permanence</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
