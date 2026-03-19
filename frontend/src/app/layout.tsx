import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/ui/Navbar";

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
  description: "Predicciones, stats y fantasy league para La Velada del Año 6",
  openGraph: {
    title: "VeladaZone — La Velada del Año 6",
    description: "Haz tus predicciones para La Velada del Año 6",
    images: ["/og-image.png"],
  },
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
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
