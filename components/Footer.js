import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";
import ThemeToggle from "@/app/components/ThemeToggle";

const Footer = () => {
  return (
    <footer className="py-14 dark:bg-black bg-gray-50">
      <div className="container px-6 md:px-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-5">
            <Link
              className="flex items-center gap-3"
              href="/"
              title={`${config.appName} hompage`}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <span className="font-bold text-xl dark:text-white text-gray-900">{config.appName}</span>
            </Link>
            <p className="text-sm dark:text-gray-400 text-gray-600 max-w-sm">
              Protégez votre vie numérique avec notre suite de sécurité avancée, conçue pour vous donner tranquillité d&apos;esprit et contrôle total.
            </p>
            
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/10 hover:bg-gray-300 transition-colors"
                aria-label="Suivez-nous sur Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-700">
                  <path d="M22 6C22 6 21.3 8.1 20 9.4C21.6 17.4 15.3 22 9 22C5.9 22 3.1 20.9 1 19C4.2 19.4 7 18.3 9 16C6 15.9 4 13.8 3 11C4 11.2 5 11.1 6 10.8C3 9.9 1 7.3 1 4.5C2 5.1 3.2 5.5 4.5 5.5C1.5 3.5 0.7 0 2.5 -2C5.8 2 10.3 4.5 15.5 4.7C15.3 4.2 15.2 3.6 15.2 3C15.2 0.3 17.5 -2 20.2 -2C21.6 -2 22.9 -1.4 23.8 -0.5C24.7 -0.8 25.5 -1.3 26.2 -1.9C25.8 -0.4 25 0.7 23.9 1.5C25 1.4 26 1.1 27 0.7C26.2 1.8 25.2 2.7 24 3.3C24 3.7 24 4.1 24 4.5C24 12 18 22 6 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/10 hover:bg-gray-300 transition-colors"
                aria-label="Suivez-nous sur LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-700">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium dark:text-white text-gray-900 mb-4">Entreprise</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition-colors">À propos</Link>
                </li>
              </ul>
              </div>

            <div>
              <h3 className="font-medium dark:text-white text-gray-900 mb-4">Produit</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/articles" className="text-sm dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition-colors">Boutique</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium dark:text-white text-gray-900 mb-4">Ressources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-sm dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
              </div>

          <div>
            <h3 className="font-medium dark:text-white text-gray-900 mb-4">Restez informé</h3>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-4">
              Recevez les dernières actualités et mises à jour sur la sécurité.
            </p>
            
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="px-4 py-2 dark:bg-white/5 bg-white border dark:border-gray-800 border-gray-300 rounded-lg dark:text-white text-gray-900 text-sm focus:outline-none dark:focus:border-purple-500 focus:border-purple-500 flex-grow"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg whitespace-nowrap"
              >
                S&apos;abonner
              </button>
            </form>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm dark:text-gray-400 text-gray-600">
                Préférence de thème
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t dark:border-gray-800 border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm dark:text-gray-400 text-gray-600">
            © {new Date().getFullYear()} {config.appName}. Tous droits réservés.
          </div>
          
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/tos" className="text-sm dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition-colors">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
