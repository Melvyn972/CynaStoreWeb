import { Poppins } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import "./globals.css";

const font = Poppins({ 
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: 'swap',
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
    
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
        document.body.classList.remove('loading');
      }
    });
    
    window.addEventListener('beforeunload', function() {
      document.body.classList.add('loading');
    });
    
  } catch (e) {
  }
})();
`;

const serviceWorkerScript = `
(function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('SW registered: ', registration);
          
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
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
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				
				<script dangerouslySetInnerHTML={{ __html: serviceWorkerScript }} />
				
				<link rel="dns-prefetch" href="//fonts.googleapis.com" />
				<link rel="dns-prefetch" href="//fonts.gstatic.com" />
				
				<link rel="preload" href="/logo.png" as="image" type="image/png" />
				
				<meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
				<meta name="format-detection" content="telephone=no" />
				
				<meta name="theme-color" content="#000000" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body 
				className="bg-white dark:bg-black text-base-content min-h-screen transition-colors duration-200 flex flex-col"
				suppressHydrationWarning={true}
			>
				<ClientLayout>{children}</ClientLayout>
				
				<script dangerouslySetInnerHTML={{
					__html: `
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
					
					let resizeTimer;
					window.addEventListener('resize', function() {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function() {
						}, 250);
					}, { passive: true });
					
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
