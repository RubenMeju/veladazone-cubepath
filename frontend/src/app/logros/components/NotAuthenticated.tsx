export function NotAuthenticated() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="font-bebas text-4xl text-white mb-2">
          Inicia sesión para ver tus logros
        </h2>
        <p className="text-white/40 text-sm">
          Conecta con Twitch y empieza a desbloquear medallas
        </p>
      </div>
    </div>
  );
}
