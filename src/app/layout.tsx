import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[#EAE3D2] text-[#1F1C18]">
        {children}
      </body>
    </html>
  );
}
