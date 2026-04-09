import Link from "next/link";
import { navLinks } from "./navlinks";

export function Footer() {
  return (
    <footer
      className="relative bg-[#050505] border-t-2 border-red-600/30 overflow-hidden"
      aria-label="Pie de página de VeladaZone"
    >
      {/* Detalle decorativo: Línea de escaneo o 'Tape' de boxeo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* SECCIÓN 1: BRANDING IMPACTANTE */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="group">
              <span className="text-3xl font-[900] italic tracking-tighter text-white uppercase leading-none">
                VELADA
                <span className="text-red-600 group-hover:text-white transition-colors">
                  ZONE
                </span>
              </span>
              <div className="h-1 w-12 bg-red-600 mt-1 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <p className="mt-6 text-gray-400 text-sm leading-relaxed font-medium">
              La central de datos definitiva para el evento del año.
              Estadísticas en tiempo real, análisis de combate y comunidad.
            </p>
          </div>

          {/* SECCIÓN 2: LINKS RÁPIDOS (Estilo Menú de Ring) */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 border-l-2 border-red-600 pl-3">
              Navegación
            </h3>
            <nav className="grid grid-cols-2 gap-3 text-sm font-medium">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* SECCIÓN 3: LEGAL */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 border-l-2 border-red-600 pl-3">
              Documentación
            </h3>
            <nav className="flex flex-col gap-3 text-sm text-gray-500 font-medium">
              <a href="/legal" className="hover:text-red-500 transition-colors">
                Aviso Legal
              </a>
              <a
                href="/privacy"
                className="hover:text-red-500 transition-colors"
              >
                Privacidad
              </a>
              <a
                href="/cookies"
                className="hover:text-red-500 transition-colors"
              >
                Cookies
              </a>
            </nav>
          </div>

          {/* SECCIÓN 4: NEWSLETTER / CONTACTO */}
          <div className="max-w-xs mx-auto">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 border-l-2 border-red-600 pl-3">
              Contacto
            </h3>
            <address className="not-italic">
              <a
                href="mailto:rubenmeju@outlook.es"
                className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 bg-black/30 border border-white/10 px-4 py-3 rounded-lg block hover:bg-red-600 hover:text-white transition-all text-center"
              >
                📬 Dudas o sugerencias
              </a>
            </address>
          </div>
        </div>

        {/* BARRA INFERIOR: DISCLAIMER PROFESIONAL */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] md:text-xs text-gray-600 uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} VELADA ZONE • ALL RIGHTS RESERVED
          </div>

          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-gray-500 max-w-md text-center md:text-right leading-tight italic">
              PROYECTO INDEPENDIENTE CREADO POR FANS. NO AFILIADO A IBAI LLANOS
              O LA VELADA DEL AÑO.
            </p>
          </div>
        </div>
      </div>

      {/* Marca de agua de fondo */}
      <div className="absolute -bottom-10 -right-10 text-[12rem] font-black text-white/[0.02] italic pointer-events-none select-none">
        VI
      </div>
    </footer>
  );
}
