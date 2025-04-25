import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-base-100 to-base-200 dark:bg-black text-base-content dark:text-white overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-100 to-base-200/90 dark:from-black dark:via-black dark:to-gray-900 opacity-90 z-0"></div>
      
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-300/20 dark:bg-purple-500/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 dark:bg-blue-500/10 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 z-10 flex flex-col items-center text-center">
        <span className="inline-block py-2 px-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:bg-white/10 backdrop-blur-md text-sm rounded-full mb-8 font-medium">
          ✨ Découvrez une nouvelle façon de créer
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-white dark:to-gray-300">
          Élevez votre vision<br />en réalité digitale
        </h1>
        
        <p className="text-xl md:text-2xl text-base-content/80 dark:text-gray-300 max-w-3xl mb-12">
          Transformez votre startup rapidement et efficacement avec des outils innovants et des solutions modernes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/auth/login" 
            className="btn px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all rounded-full text-lg font-medium"
          >
            Commencer
          </Link>
          <Link 
            href="#features" 
            className="btn px-8 py-4 bg-base-200/80 dark:bg-white/10 backdrop-blur-md hover:bg-base-300 dark:hover:bg-white/20 text-base-content dark:text-white transition-all rounded-full text-lg font-medium"
          >
            Découvrir
        </Link>
        </div>

        <div className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-base-300 dark:border-white/10 shadow-lg dark:shadow-2xl">
        <Image
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=75"
          alt="Interface produit"
          width={1920}
          height={1280}
          className="w-full h-auto object-cover"
          priority={true}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 1200px"
          quality={80}
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 dark:to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
