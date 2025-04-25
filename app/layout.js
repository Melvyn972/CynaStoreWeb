import { Poppins } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import "./globals.css";
import Head from "next/head";

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

export default function RootLayout({ children }) {
	return (
		<html
			lang="fr"
			className={`${font.className} antialiased`}
			suppressHydrationWarning
		>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<body className="bg-white dark:bg-black text-base-content">
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
