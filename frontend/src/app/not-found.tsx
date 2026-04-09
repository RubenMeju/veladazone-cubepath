import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050505] overflow-hidden text-white px-4 font-sans">
      {/* 1. EFECTO DE LUCES DE ARENA (Fondo) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-red-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-red-900/10 to-transparent" />
        {/* Textura de grano/ruido para dar realismo */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 2. OVERLAY DE TEXTO DE FONDO (Estilo Streetwear/Eventos) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.02] font-black text-[20vw] leading-none whitespace-nowrap">
        LA VELADA VI • LA VELADA VI
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Badge superior estilo 'Undercard' */}
        <span className="mb-4 px-3 py-1 border border-red-500 text-red-500 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Fuera de Combate
        </span>

        {/* El 404 con efecto de profundidad */}
        <div className="relative">
          <h1 className="text-[10rem] md:text-[15rem] font-black italic leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-400 to-gray-700 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            404
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-red-600 skew-x-[-20deg] shadow-[0_0_20px_#ea0000]" />
        </div>

        <div className="mt-8 text-center max-w-md">
          <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">
            ¡Te han mandado a la lona!
          </h2>
          <p className="mt-4 text-gray-400 font-medium leading-relaxed">
            El árbitro ha contado hasta diez y no hemos encontrado esta página.
            Prepárate para el siguiente round regresando a la zona segura.
          </p>
        </div>

        {/* 4. BOTONES ESTILO 'CALL TO ACTION' DE COMBATE */}
        <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full max-w-sm sm:max-w-none justify-center">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-red-600 overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
            <span className="relative z-10 text-white font-black uppercase italic group-hover:text-black flex items-center justify-center gap-2">
              Regresar al Ring
            </span>
          </Link>

          <Link
            href="/blog"
            className="px-8 py-4 border-2 border-white/10 hover:border-white transition-colors font-black uppercase italic flex items-center justify-center"
          >
            Noticias de la Velada
          </Link>
        </div>
      </div>

      {/* 5. ELEMENTOS DE DECORACIÓN (Cuerdas del ring) */}
      <div className="absolute bottom-10 left-0 w-full opacity-20">
        <div className="h-[2px] bg-white my-2 w-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        <div className="h-[2px] bg-red-600 my-2 w-full shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
        <div className="h-[2px] bg-white my-2 w-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  );
}
