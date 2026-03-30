import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/ui/Navbar";
import PwaInstallBanner from "@/components/PwaInstallBanner";
import { DevAuthInit } from "@/components/DevAuthInit";
import { CookieBanner } from "./(legal)/components/CookieBanner";
import { Footer } from "@/components/ui/Footer";

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
  title: "VeladaZone — La Velada del Año 6",
  description:
    "Predicciones, debate, fantasy league y más para La Velada del Año 6",
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
        <Providers>
          <DevAuthInit />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
          <PwaInstallBanner />
        </Providers>
      </body>
    </html>
  );
}
