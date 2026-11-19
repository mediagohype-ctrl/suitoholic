import type { Metadata } from "next";
import { cache } from "react";
import "./globals.css";
import StudioBackground from "@/components/StudioBackground";
import { mergeContent } from "@/content/merge";
import { contentDefaults } from "@/content/registry";
import { CartProvider } from "@/context/CartProvider";
import { WishlistProvider } from "@/context/WishlistProvider";
import { CustomizerModalProvider } from "@/context/CustomizerModalProvider";
import { SiteDataProvider } from "@/context/SiteDataProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { getSiteBundle } from "@/lib/site-data";

// Render the shell per request while sharing the short-lived public storefront data cache.
export const dynamic = "force-dynamic";

const loadSite = cache(getSiteBundle);
const fontStylesheets = [
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Pinyon+Script&family=Great+Vibes&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  "https://fonts.cdnfonts.com/css/sf-pro-display",
];

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadSite();
  const seo = mergeContent(contentDefaults.seo, content.seo);
  return {
    title: seo.title,
    description: seo.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png" },
        { url: "/logo/suitoholic-logo-dark.png", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await loadSite();

  return (
    <html lang="en" suppressHydrationWarning className="h-full w-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function removeBadges() {
                  var els = document.querySelectorAll('nextjs-portal, [data-nextjs-dev-indicator], [data-nextjs-toast-wrapper], #nextjs-dev-indicator');
                  for (var i = 0; i < els.length; i++) els[i].remove();
                }
                removeBadges();
                if (window.MutationObserver) {
                  new MutationObserver(removeBadges).observe(document.documentElement, { childList: true, subtree: true });
                }
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{
          __html: `
            ${JSON.stringify(fontStylesheets)}.forEach(function (href) {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.media = "print";
              link.href = href;
              link.addEventListener("load", function () { link.media = "all"; }, { once: true });
              document.head.appendChild(link);
            });
          `,
        }} />
        <noscript>
          {fontStylesheets.map((href) => <link key={href} rel="stylesheet" href={href} />)}
        </noscript>
      </head>
      <body suppressHydrationWarning className="min-h-full w-full flex flex-col bg-[#ECEAE5] text-[#000000] relative selection:bg-[#000000] selection:text-white font-sans">
        {/* Global BLUORNG Warm Alabaster Canvas Atmosphere */}
        <StudioBackground />

        {/* Page Content Container */}
        <div className="relative z-10 flex-1 flex flex-col min-h-screen w-full overflow-x-clip">
          <SmoothScrollProvider>
            <SiteDataProvider value={site}>
              <CartProvider>
                <WishlistProvider>
                  <CustomizerModalProvider>{children}</CustomizerModalProvider>
                </WishlistProvider>
              </CartProvider>
            </SiteDataProvider>
          </SmoothScrollProvider>
        </div>
      </body>
    </html>
  );
}
