import type { Metadata } from "next";
import { cache } from "react";
import { Orbitron } from "next/font/google";
import "./globals.css";
import StudioBackground from "@/components/StudioBackground";
import { mergeContent } from "@/content/merge";
import { contentDefaults } from "@/content/registry";
import { CartProvider } from "@/context/CartProvider";
import { SiteDataProvider } from "@/context/SiteDataProvider";
import { getSiteBundle } from "@/lib/site-data";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

// Content, catalog and prices are edited live from /admin, so render on every request.
export const dynamic = "force-dynamic";

const loadSite = cache(getSiteBundle);

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadSite();
  const seo = mergeContent(contentDefaults.seo, content.seo);
  return { title: seo.title, description: seo.description };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await loadSite();

  return (
    <html lang="en" suppressHydrationWarning className={`h-full w-full overflow-x-hidden antialiased ${orbitron.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Michroma&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cinzel:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-white text-[#14110E] relative selection:bg-[#9E774C] selection:text-white font-sans">
        {/* Global Studio Atmosphere: Clean Crisp White Background */}
        <StudioBackground />

        {/* Page Content Container */}
        <div className="relative z-10 flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <SiteDataProvider value={site}>
            <CartProvider>{children}</CartProvider>
          </SiteDataProvider>
        </div>
      </body>
    </html>
  );
}
