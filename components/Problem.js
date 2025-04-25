const ProblemCard = ({ number, title, description }) => {
  return (
    <div className="bg-gradient-to-br from-base-200 to-base-300/70 dark:bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 hover:shadow-lg hover:from-base-100 hover:to-base-200 dark:hover:bg-white/10 transition-all duration-300 border border-base-300 dark:border-white/5">
      <div className="flex items-start gap-5">
        <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400">
          {number}
        </span>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-base-content dark:text-white mb-3">{title}</h3>
          <p className="text-base-content/80 dark:text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Problem = () => {
  return (
    <section className="relative bg-gradient-to-b from-base-100 to-base-200 dark:bg-black text-base-content dark:text-white py-24 md:py-32 overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200/90 dark:from-black dark:via-black dark:to-gray-900 opacity-95 z-0"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-300/20 via-blue-300/20 to-transparent dark:from-purple-500/10 dark:via-transparent dark:to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-300/20 via-purple-300/20 to-transparent dark:from-blue-500/10 dark:via-transparent dark:to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="inline-block py-1 px-3 text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:bg-white/10 text-base-content dark:text-white rounded-full mb-6 font-medium">
            Le défi
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-base-content dark:text-white">
            83% des entreprises font face à des <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400">pertes financières</span> dues à une sécurité inadéquate
        </h2>
          <p className="text-xl text-base-content/80 dark:text-gray-300">
            Menaces persistantes avancées, réglementations de conformité, architecture de sécurité fragmentée — le paysage actuel de la cybersécurité présente une complexité sans précédent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <ProblemCard 
            number="01"
            title="Surface d'attaque vulnérable"
            description="Les entreprises disposent en moyenne de 254 applications critiques, créant une surface d'attaque extensive que les équipes de sécurité peinent à surveiller efficacement."
          />
          
          <ProblemCard 
            number="02"
            title="Temps de détection prolongé"
            description="Le temps moyen de détection d'une violation est de 287 jours, permettant aux attaquants d'accéder aux systèmes critiques et de dérober des données sensibles."
          />
          
          <ProblemCard 
            number="03"
            title="Impact catastrophique pour l'entreprise"
            description="Le coût moyen d'une violation de données atteint 4,35 millions de dollars, sans compter les dommages à la réputation et la perte de confiance des clients."
          />
        </div>
        
        <div className="mt-20 relative">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300/30 dark:via-gray-800 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mt-16 max-w-5xl mx-auto">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:bg-white/10 shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-base-content dark:text-white">500+</h4>
                <p className="text-base-content/70 dark:text-gray-400">Entreprises protégées</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:bg-white/10 shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-base-content dark:text-white">99.8%</h4>
                <p className="text-base-content/70 dark:text-gray-400">Taux de détection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:bg-white/10 shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-base-content dark:text-white">15 min</h4>
                <p className="text-base-content/70 dark:text-gray-400">Temps de réponse moyen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
