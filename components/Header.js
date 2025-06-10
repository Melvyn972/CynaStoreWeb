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
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    href: "/articles",
    label: "Boutique",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    href: "/#faq",
    label: "FAQ",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
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
    <header className={`ios-nav z-nav ${scrolled ? 'ios-nav-scrolled' : 'bg-transparent'}`}>
      <nav className="ios-container px-6 md:px-10 mx-auto py-4 z-nav">
        <div className="flex items-center justify-between z-nav">
          {/* Logo */}
          <Link
            className="flex items-center gap-3 group relative z-nav"
            href="/"
            title={`${config.appName} homepage`}
          >
            <div className="relative">
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                placeholder="blur"
                priority={true}
                width={40}
                height={40}
                quality={90}
              />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
              {config.appName}
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex lg:items-center lg:gap-8 relative z-nav">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 group relative z-nav"
                title={link.label}
              >
                <span className="text-purple-400 group-hover:text-purple-300 transition-colors relative z-nav">
                  {link.icon}
                </span>
                <span className="font-medium relative z-nav">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 relative z-nav">
            <div className="relative z-nav">
              <CartCount />
            </div>
            <div className="relative z-nav">
              <ThemeToggle />
            </div>
            
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 ios-button-primary relative z-nav"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user?.name || "Account"}
                    className="w-6 h-6 rounded-full border-2 border-white/30"
                    referrerPolicy="no-referrer"
                    width={24}
                    height={24}
                    quality={90}
                  />
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-400 text-white flex justify-center items-center rounded-full text-sm font-semibold">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                  </div>
                )}
                <span className="font-medium">
                  {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0] || "Compte"}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="ios-button-primary flex items-center gap-2 relative z-nav"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
                Commencer
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3 relative z-nav">
            <div className="relative z-nav">
              <CartCount />
            </div>
            <div className="relative z-nav">
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="ios-button-secondary p-3 relative z-nav"
              onClick={() => setIsOpen(true)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xl" 
          onClick={() => setIsOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className="fixed inset-y-0 right-0 w-full max-w-sm ios-glass border-l border-purple-500/20 transform transition-transform duration-300">
          <div className="flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <Link
                className="flex items-center gap-3"
                href="/"
                title={`${config.appName} homepage`}
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src={logo}
                  alt={`${config.appName} logo`}
                  className="w-8 h-8"
                  placeholder="blur"
                  priority={true}
                  width={32}
                  height={32}
                  quality={90}
                />
                <span className="font-bold text-xl text-white">{config.appName}</span>
              </Link>
              
              <button
                type="button"
                className="ios-button-secondary p-3"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Fermer le menu</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 space-y-4">
              {links.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className="flex items-center gap-4 p-4 rounded-2xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                    {link.icon}
                  </span>
                  <span className="font-medium text-lg">{link.label}</span>
                </Link>
              ))}
            </nav>
            
            {/* Auth Section */}
            <div className="pt-6 border-t border-white/10">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 p-4 rounded-2xl ios-glass-light hover:bg-white/20 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name || "Account"}
                      className="w-10 h-10 rounded-full border-2 border-purple-400/50"
                      referrerPolicy="no-referrer"
                      width={40}
                      height={40}
                      quality={90}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 text-white flex justify-center items-center rounded-full text-lg font-semibold">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-white">
                      {session.user?.name || session.user?.email || "Utilisateur"}
                    </div>
                    <div className="text-sm text-white/60">Voir le tableau de bord</div>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full ios-button-primary justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
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
