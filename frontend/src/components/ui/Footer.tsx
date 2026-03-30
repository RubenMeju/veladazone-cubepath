export function Footer() {
  return (
    <footer
      className="border-t border-white/5 mt-20"
      aria-label="Pie de página de VeladaZone"
    >
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-400">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Branding */}
          <div>
            <p className="text-white font-semibold mb-2">VeladaZone</p>
            <p className="max-w-xs text-gray-400">
              Plataforma independiente de estadísticas, predicciones y comunidad
              sobre La Velada del Año.
            </p>
          </div>

          {/* Links legales */}
          <nav aria-label="Enlaces legales" className="flex flex-col gap-2">
            <p className="text-white font-medium mb-1">Legal</p>
            <a href="/legal" className="hover:text-white transition-colors">
              Aviso Legal
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Política de Cookies
            </a>
          </nav>

          {/* Info de contacto */}
          <address className="not-italic">
            <p className="text-white font-medium mb-1">Contacto</p>
            <a
              href="mailto:rubenmeju@outlook.es"
              className="hover:text-white transition-colors"
            >
              rubenmeju@outlook.es
            </a>
          </address>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 text-xs text-gray-500 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} VeladaZone</p>
          <p>
            No afiliado oficialmente a La Velada del Año ni a sus organizadores.
          </p>
        </div>
      </div>
    </footer>
  );
}
