import { Poppins } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import "./globals.css";

const font = Poppins({ 
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const viewport = {
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags();

// Script pour initialiser le thème immédiatement
const themeScript = `
(function() {
  try {
    const storedTheme = localStorage.getItem('theme');
    let theme = 'light';
    
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      theme = storedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'cynaStore-dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'cynaStore');
    }
  } catch (e) {
    console.warn('Error initializing theme:', e);
  }
})();
`;

export default function RootLayout({ children }) {
	return (
		<html
			lang="fr"
			className={`${font.className} antialiased`}
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="bg-white dark:bg-black text-base-content min-h-screen transition-colors duration-200">
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
