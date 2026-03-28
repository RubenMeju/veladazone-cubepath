import { CountdownSection } from "./CountdownSection";
import Link from "next/link";
import ScrollIndicator from "./ScrollIndicator";
import HeroBackground from "./HeroBackground";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Background */}
      <HeroBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Event badge */}
        <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/25 rounded-full px-4 py-2 text-[#e63946] mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-pulse flex-shrink-0" />
          <span className="tracking-widest text-[10px] sm:text-sm font-medium uppercase">
            25 Julio 2026 · Estadio La Cartuja · Sevilla
          </span>
        </div>

        {/* Title */}
        <h1 className="font-bebas text-[clamp(3rem,12vw,8rem)] text-white tracking-wider leading-none mb-2">
          VELADA DEL AÑO
        </h1>

        {/* The 6 */}
        <div className="relative mb-6 leading-none">
          <span
            className="font-bebas text-[clamp(6rem,25vw,18rem)] leading-none select-none block"
            style={{
              WebkitTextStroke: "2px #e63946",
              color: "transparent",
              textShadow:
                "0 0 80px rgba(230,57,70,0.4), 0 0 160px rgba(230,57,70,0.2)",
            }}
          >
            6
          </span>
        </div>

        <p className="text-gray-400 text-sm sm:text-base max-w-sm sm:max-w-xl mx-auto mb-10 leading-relaxed px-2">
          Haz tus predicciones, compite en ligas con amigos y vive la noche más
          épica del streaming hispano.
        </p>

        {/* Countdown */}
        <CountdownSection />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
          <Link
            href="/predicciones"
            className="group relative overflow-hidden bg-[#e63946] hover:bg-[#c1121f] text-white font-bebas text-lg sm:text-xl tracking-widest px-8 sm:px-10 py-3 sm:py-4 rounded transition-all duration-200"
          >
            <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            HACER PREDICCIONES
          </Link>
          <Link
            href="/fantasy"
            className="group relative overflow-hidden bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white font-bebas text-lg sm:text-xl tracking-widest px-8 sm:px-10 py-3 sm:py-4 rounded transition-all duration-200"
          >
            CREAR LIGA FANTASY
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
};
