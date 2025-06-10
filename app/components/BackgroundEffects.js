const BackgroundEffects = () => {
  return (
    <>
      {/* Background de base - adapté aux thèmes */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-purple-950/50"></div>
      
      {/* Effets de lumière flottants - adaptés aux thèmes */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full 
                      bg-purple-500/20 dark:bg-purple-500/20 blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full 
                      bg-indigo-500/15 dark:bg-indigo-500/15 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full 
                      bg-purple-400/10 dark:bg-purple-400/10 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      
      {/* Effets supplémentaires pour plus de profondeur */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full 
                      bg-indigo-600/10 dark:bg-indigo-600/10 blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full 
                      bg-purple-600/15 dark:bg-purple-600/15 blur-3xl animate-float" style={{animationDelay: '8s'}}></div>
      
      {/* Points de lumière - adaptés aux thèmes */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 z-10">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-700 dark:bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-indigo-700 dark:bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/6 left-1/5 w-1.5 h-1.5 bg-purple-800 dark:bg-purple-200 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/5 right-1/5 w-1.5 h-1.5 bg-indigo-800 dark:bg-indigo-200 rounded-full animate-pulse" style={{animationDelay: '5s'}}></div>
        {/* Points supplémentaires pour plus de richesse */}
        <div className="absolute top-1/5 left-1/3 w-2 h-2 bg-purple-600 dark:bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '6s'}}></div>
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '7s'}}></div>
        <div className="absolute bottom-2/5 left-1/6 w-2.5 h-2.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '8s'}}></div>
      </div>
    </>
  );
};

export default BackgroundEffects; 