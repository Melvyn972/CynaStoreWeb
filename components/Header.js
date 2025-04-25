"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/app/components/ThemeToggle";
import CartCount from "@/components/CartCount";
import logo from "@/app/icon.png";
import config from "@/config";

const links = [
  {
    href: "/#",
    label: "Accueil",
  },
  {
    href: "/articles",
    label: "Boutique",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

const Header = () => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-base-100/80 dark:bg-black/80 backdrop-blur-lg border-b border-base-200 dark:border-white/5 py-3' : 'bg-transparent py-6'
    }`}>
      <nav
        className="container flex items-center justify-between px-6 md:px-10 mx-auto"
        aria-label="Global"
      >
        <div className="flex">
          <Link
            className="flex items-center gap-3"
            href="/"
            title={`${config.appName} hompage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8 h-auto"
              placeholder="blur"
              priority={true}
              width={32}
              height={36}
              quality={90}
            />
            <span className="font-bold text-xl text-base-content dark:text-white">{config.appName}</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <div className="flex items-center gap-3">
            <CartCount />
            <ThemeToggle />
          <button
            type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content dark:text-white hover:text-primary dark:hover:text-gray-300 transition-colors"
            onClick={() => setIsOpen(true)}
          >
              <span className="sr-only">Ouvrir le menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
                className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-10">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-base-content/80 dark:text-white/80 hover:text-base-content dark:hover:text-white transition-colors text-sm font-medium"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <CartCount />
          <ThemeToggle />
          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm font-medium rounded-full transition-all flex items-center gap-2"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user?.name || "Account"}
                  className="w-6 h-6 rounded-full"
                  referrerPolicy="no-referrer"
                  width={24}
                  height={24}
                  quality={90}
                />
              ) : (
                <span className="w-6 h-6 bg-white dark:bg-gray-800 text-black dark:text-white flex justify-center items-center rounded-full shrink-0">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                </span>
              )}
              <span>{session.user?.name || session.user?.email || "Compte"}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm font-medium rounded-full transition-all"
            >
              Commencer
            </Link>
          )}
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-base-300/50 dark:bg-black/60 backdrop-blur-lg" onClick={() => setIsOpen(false)}></div>
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-base-100 to-base-200 dark:bg-black p-6 overflow-y-auto transform transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <Link
              className="flex items-center gap-3"
              href="/"
              title={`${config.appName} hompage`}
              onClick={() => setIsOpen(false)}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8 h-auto"
                placeholder="blur"
                priority={true}
                width={32}
                height={36}
                quality={90}
              />
              <span className="font-bold text-xl text-base-content dark:text-white">{config.appName}</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <CartCount />
              <ThemeToggle />
            <button
              type="button"
                className="text-base-content dark:text-white hover:text-primary dark:hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
                <span className="sr-only">Fermer le menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            </div>
          </div>

          <div className="flex flex-col gap-y-6 mt-10">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="text-base-content/80 dark:text-white/80 hover:text-base-content dark:hover:text-white transition-colors text-lg font-medium"
                    title={link.label}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
            
            <div className="mt-8">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="inline-block w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 text-center font-medium rounded-full transition-all flex items-center justify-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name || "Account"}
                      className="w-6 h-6 rounded-full"
                      referrerPolicy="no-referrer"
                      width={24}
                      height={24}
                      quality={90}
                    />
                  ) : (
                    <span className="w-6 h-6 bg-white dark:bg-gray-800 text-black dark:text-white flex justify-center items-center rounded-full shrink-0">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                    </span>
                  )}
                  <span>{session.user?.name || session.user?.email || "Compte"}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-block w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 text-center font-medium rounded-full transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Commencer
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
