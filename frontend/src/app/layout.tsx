import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";

import "./globals.css";

// ── SEO ──────────────────────────────────────────────────────────
import { siteMetadata, siteViewport } from "@/lib/seo/metadata";
import { eventJsonLd } from "@/lib/seo/event-jsonld";

// ── Layout components ────────────────────────────────────────────
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import { DevAuthInit } from "@/components/DevAuthInit";

// ── Providers ────────────────────────────────────────────────────
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { ConsentProvider } from "@/components/providers/ConsentProvider";

// ── RGPD ─────────────────────────────────────────────────────────
import { CookieBanner } from "./(legal)/components/CookieBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

// ── Fonts ─────────────────────────────────────────────────────────
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// ── Exports de Next.js ────────────────────────────────────────────
export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = siteViewport;

// ── Root Layout ───────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bebas.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD — renderizado en SSR, nunca hidratado por React */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </head>

      <body className="bg-[#0f0f0f] text-white min-h-screen">
        <ConsentProvider>
          <QueryProvider>
            <DevAuthInit />
            <AnalyticsProvider />

            {/*
              GA se monta SOLO si consent.analytics === true.
              Si el usuario revoca, el script se desmonta y se
              desactiva via ga-disable-{GA_ID}.
            */}
            <GoogleAnalytics />

            <Navbar />
            <main>{children}</main>
            <Footer />

            {/* Banner RGPD — visible hasta que el usuario decida */}
            <CookieBanner />
            <PwaInstallBanner />
          </QueryProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
