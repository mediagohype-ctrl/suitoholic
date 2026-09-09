import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import StudioBackground from "@/components/StudioBackground";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Suitoholic™ - Tailored for You | Custom Shirts & Suits ESTD. 2003",
  description: "Experience bespoke luxury tailoring with Suitoholic. Tailored for your unique body type, chest size, fit preference, and custom initial embroidery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body suppressHydrationWarning className="min-h-full w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-[#D7C2AD] text-[#14110E] relative selection:bg-[#9E774C] selection:text-white font-sans">
        {/* Global Studio Atmosphere: Exact Warm Sand Tone #D7C2AD + Sun Disk + Palm Shadows */}
        <StudioBackground />
        
        {/* Page Content Container */}
        <div className="relative z-10 flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}

