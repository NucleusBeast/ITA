import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITA Planner",
  description: "Frontend-first event planning platform UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
      >
        <ToastProvider>
          <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
            <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(244,140,95,0.4),_transparent_55%)]" />
            <div className="absolute -right-44 top-56 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(86,172,190,0.45),_transparent_65%)] blur-2xl" />
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
