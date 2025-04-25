import Link from "next/link";
import config from "@/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from "@/app/icon.png";
import { ThemeProvider } from "@/app/context/ThemeContext";
import ThemeToggle from "@/app/components/ThemeToggle";

export const metadata = {
  title: `Authentication - ${config.appName}`,
  description: `Login or create an account for ${config.appName}`,
};

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen dark:bg-black bg-gray-50 relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-gray-900 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-95 z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-transparent bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 dark:bg-gradient-to-tr dark:from-blue-500/10 dark:to-transparent bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Header */}
        <header className="relative z-10 py-6 px-6 md:px-10 max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span className="font-bold text-xl dark:text-white text-gray-900">{config.appName}</span>
          </Link>
          <ThemeToggle />
        </header>
        
        <main className="relative z-10">{children}</main>
        
        {/* Footer */}
        <footer className="relative z-10 mt-auto py-6 px-6 md:px-10 max-w-7xl mx-auto text-center dark:text-gray-400 text-gray-500 text-sm">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p>© {new Date().getFullYear()} {config.appName}. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="dark:hover:text-white hover:text-gray-800 transition-colors">Politique de confidentialité</Link>
              <Link href="/tos" className="dark:hover:text-white hover:text-gray-800 transition-colors">Conditions d&apos;utilisation</Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
} 