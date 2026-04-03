import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import { DevAuthInit } from "@/components/DevAuthInit";
import { CookieBanner } from "./(legal)/components/CookieBanner";
import { Footer } from "@/components/ui/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://laveladazone.com"),

  title: {
    default: "VeladaZone — La Velada del Año 6",
    template: "%s | VeladaZone",
  },

  description:
    "Predice los ganadores de La Velada del Año 6, compite en el ranking global y comparte tu cartel. Login con Twitch.",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VeladaZone",
  },

  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },

  alternates: {
    canonical: "/", // usa metadataBase
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/", // usa metadataBase
    siteName: "VeladaZone",
    title: "VeladaZone — La Velada del Año 6",
    description:
      "Predice los ganadores de La Velada del Año 6, compite en el ranking global y comparte tu cartel. Login con Twitch.",
    images: [
      {
        url: "/og-image.png", // consistente y relativa
        width: 1200,
        height: 630,
        alt: "VeladaZone — La Velada del Año 6",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VeladaZone — La Velada del Año 6",
    description:
      "Predice los ganadores de La Velada del Año 6, compite en el ranking global y comparte tu cartel.",
    images: ["/og-image.png"], // unificado (antes mezclabas webp/png)
  },
};

export const viewport: Viewport = {
  themeColor: "#e63946",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bebas.variable} ${inter.variable}`}>
      <body className="bg-[#0f0f0f] text-white min-h-screen">
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `,
          }}
        />

        <QueryProvider>
          <DevAuthInit />
          <AnalyticsProvider />

          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
          <PwaInstallBanner />
        </QueryProvider>
      </body>
    </html>
  );
}
