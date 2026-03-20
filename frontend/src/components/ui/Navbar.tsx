"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { twitchLoginUrl } from "@/lib/api";
import { UserBadge } from "./UserBadge";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/stats", label: "Stats" },
  { href: "/predicciones", label: "Predicciones" },
  { href: "/fantasy", label: "Fantasy" },
  { href: "/mi-cartel", label: "🃏 Mi Cartel" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/logout/`,
        { credentials: "include" },
      );
    } catch {}
    logout(); // limpia el store de Zustand
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bebas text-2xl text-white tracking-wider hover:text-[#e63946] transition-colors"
        >
          🥊 VeladaZone
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#e63946] bg-[#e63946]/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated() && user ? (
            <div className="flex items-center gap-3">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.twitch_username}
                  className="w-8 h-8 rounded-full border border-[#2a2a2a]"
                />
              )}
              <div className="hidden md:block">
                <div className="text-sm text-gray-300">
                  {user.twitch_username}
                </div>
                <UserBadge />
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <a
              href={twitchLoginUrl}
              className="flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white text-sm font-medium px-4 py-2 rounded transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Entrar con Twitch
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
