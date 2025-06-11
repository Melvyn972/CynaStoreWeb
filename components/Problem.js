const ProblemCard = ({ number, title, description }) => {
  return (
    <div className="ios-card group hover:scale-105 transition-all duration-300 p-8">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            {number}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">{title}</h3>
          <p className="text-gray-700 dark:text-white/80 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Problem = () => {
  return (
    <section id="problem" className="relative bg-gray-50 dark:bg-gray-950 py-24 md:py-32 overflow-hidden">
      {/* Effets de lumière flottants */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-400/10 dark:bg-purple-400/10 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="ios-container px-6 md:px-10 relative z-10">
        <div className="max-w-3xl mb-16 md:mb-24 ios-fade-in">
          <span className="ios-badge-primary mb-6">
            Le défi
          </span>
          <h2 className="ios-title mb-8 leading-tight">
            83% des entreprises font face à des <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">pertes financières</span> dues à une sécurité inadéquate
          </h2>
          <p className="ios-body text-xl">
            Menaces persistantes avancées, réglementations de conformité, architecture de sécurité fragmentée — le paysage actuel de la cybersécurité présente une complexité sans précédent.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 ios-slide-up" style={{animationDelay: '0.2s'}}>
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
        
        <div className="mt-20 relative ios-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 mt-16 max-w-6xl mx-auto">
            <div className="flex items-center gap-6 ios-glass rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-400">
                  <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11V5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">500+</h4>
                <p className="text-gray-600 dark:text-white/70">Entreprises protégées</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 ios-glass rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 dark:text-indigo-400">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">99.8%</h4>
                <p className="text-gray-600 dark:text-white/70">Taux de détection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 ios-glass rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600 dark:text-purple-400">
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
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">15 min</h4>
                <p className="text-gray-600 dark:text-white/70">Temps de réponse moyen</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
