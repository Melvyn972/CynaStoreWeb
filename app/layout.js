import { Poppins } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import "./globals.css";

// Optimisation du chargement des polices
const font = Poppins({ 
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: 'swap', // Améliore le LCP
	preload: true,
	fallback: ['system-ui', 'arial'],
});

export const viewport = {
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export const metadata = getSEOTags();

// Script optimisé pour initialiser le thème immédiatement (inline critique)
const themeScript = `
(function() {
  try {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    let theme = 'light';
    
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      theme = storedTheme;
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'cynaStore-dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'cynaStore');
    }
    
    // Optimisation pour back/forward cache
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
        // Page restaurée depuis le cache
        document.body.classList.remove('loading');
      }
    });
    
    // Préparation pour le cache navigation
    window.addEventListener('beforeunload', function() {
      document.body.classList.add('loading');
    });
    
  } catch (e) {
    // Fallback silencieux
  }
})();
`;

// Script du service worker pour améliorer le cache
const serviceWorkerScript = `
(function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('SW registered: ', registration);
          
          // Vérifier les mises à jour
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                if (confirm('Une nouvelle version est disponible. Recharger la page?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch(function(registrationError) {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
})();
`;

export default function RootLayout({ children }) {
	return (
		<html
			lang="fr"
			className={`${font.className} antialiased`}
			suppressHydrationWarning={true}
		>
			<head>
				{/* Script critique inline pour éviter les ressources bloquantes */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				
				{/* Service Worker pour améliorer le cache */}
				<script dangerouslySetInnerHTML={{ __html: serviceWorkerScript }} />
				
				{/* Préconnexions DNS pour optimiser les ressources externes */}
				<link rel="dns-prefetch" href="//fonts.googleapis.com" />
				<link rel="dns-prefetch" href="//fonts.gstatic.com" />
				
				{/* Préchargement des ressources critiques */}
				<link rel="preload" href="/logo.png" as="image" type="image/png" />
				
				{/* Meta tags pour améliorer le cache */}
				<meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
				<meta name="format-detection" content="telephone=no" />
				
				{/* PWA et service worker */}
				<meta name="theme-color" content="#000000" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body 
				className="bg-white dark:bg-black text-base-content min-h-screen transition-colors duration-200"
				suppressHydrationWarning={true}
			>
				<ClientLayout>{children}</ClientLayout>
				
				{/* Script pour optimiser les interactions */}
				<script dangerouslySetInnerHTML={{
					__html: `
					// Optimisation des événements de scroll
					let ticking = false;
					function updateScrolling() {
						ticking = false;
					}
					
					function requestScrollTick() {
						if (!ticking) {
							requestAnimationFrame(updateScrolling);
							ticking = true;
						}
					}
					
					window.addEventListener('scroll', requestScrollTick, { passive: true });
					
					// Optimisation du redimensionnement
					let resizeTimer;
					window.addEventListener('resize', function() {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function() {
							// Actions après redimensionnement
						}, 250);
					}, { passive: true });
					
					// Préconnexion pour les ressources critiques
					function preconnectResources() {
						const links = [
							'//fonts.googleapis.com',
							'//fonts.gstatic.com'
						];
						
						links.forEach(function(href) {
							const link = document.createElement('link');
							link.rel = 'preconnect';
							link.href = href;
							link.crossOrigin = 'anonymous';
							document.head.appendChild(link);
						});
					}
					
					if (document.readyState === 'loading') {
						document.addEventListener('DOMContentLoaded', preconnectResources);
					} else {
						preconnectResources();
					}
					`
				}} />
			</body>
		</html>
	);
}
