"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { twitchLoginUrl } from "@/lib/api";
import { UserBadge } from "./UserBadge";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/stats", label: "Stats" },
  { href: "/predicciones", label: "Predicciones" },
  { href: "/fantasy", label: "Fantasy" },
  { href: "/mi-cartel", label: "🃏 Cartel" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/logout/`,
        { credentials: "include" },
      );
    } catch {}
    logout();
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-bebas text-xl sm:text-2xl text-white tracking-wider hover:text-[#e63946] transition-colors flex-shrink-0"
          >
            🥊 VeladaZone
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  pathname === link.href
                    ? "text-[#e63946] bg-[#e63946]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isAuthenticated() && user ? (
              <>
                {/* Avatar — siempre visible */}
                <Link
                  href={`/perfil/${user.twitch_username}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.twitch_username}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-xs">
                      👤
                    </div>
                  )}
                  {/* Username — solo desktop */}
                  <div className="hidden md:block">
                    <div className="text-xs sm:text-sm text-gray-300 leading-tight">
                      {user.twitch_username}
                    </div>
                    <UserBadge />
                  </div>
                </Link>
                {/* Salir — solo desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-xs text-gray-600 hover:text-white transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              /* Twitch login — icono en móvil, texto en desktop */
              <a
                href={twitchLoginUrl}
                className="flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-3 sm:px-4 py-2 rounded transition-colors"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                <span className="hidden sm:inline text-sm">Entrar</span>
              </a>
            )}

            {/* Hamburger — solo móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1.5 rounded hover:bg-white/5 transition-colors"
              aria-label="Menú"
            >
              <span
                className={`block w-5 h-px bg-white transition-all duration-200 origin-center ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block w-5 h-px bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-px bg-white transition-all duration-200 origin-center ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-[#050505]/98 backdrop-blur-sm flex flex-col">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-bebas text-2xl tracking-wider px-4 py-3 rounded-xl transition-colors ${
                  pathname === link.href
                    ? "text-[#e63946] bg-[#e63946]/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mx-4" />

          {/* Auth section */}
          <div className="p-4">
            {isAuthenticated() && user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={`/perfil/${user.twitch_username}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt={user.twitch_username}
                      className="w-10 h-10 rounded-full border border-white/10"
                    />
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {user.twitch_username}
                    </div>
                    <UserBadge />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <a
                href={twitchLoginUrl}
                className="flex items-center justify-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-bebas text-xl tracking-widest px-6 py-4 rounded-xl transition-colors w-full"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                ENTRAR CON TWITCH
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
