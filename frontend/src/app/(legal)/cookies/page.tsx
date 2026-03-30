export default function CookiesPage() {
  return (
    <div className="page-container max-w-3xl mx-auto py-16 text-sm text-gray-400">
      <h1 className="text-3xl text-white mb-6 font-bold">
        Política de Cookies
      </h1>

      <p className="mb-4">
        Esta web utiliza cookies propias y de terceros para ofrecer una mejor
        experiencia, funcionalidad y seguridad. Esta política describe qué
        cookies se usan, su finalidad y cómo gestionarlas.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        ¿Qué son las cookies?
      </h2>
      <p>
        Las cookies son pequeños archivos que se almacenan en tu navegador y que
        permiten recordar tus preferencias, sesiones y mejorar la interacción
        con el sitio web.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Tipos de cookies utilizadas
      </h2>
      <ul className="list-disc ml-5 space-y-1">
        <li>
          <strong>Técnicas o necesarias:</strong> necesarias para el correcto
          funcionamiento de la web, como mantener la sesión iniciada o cargar
          componentes.
        </li>
        <li>
          <strong>Autenticación:</strong> cookies de Twitch OAuth usadas para
          iniciar sesión de forma segura (HttpOnly, JWT).
        </li>
        <li>
          <strong>Funcionales:</strong> permiten recordar tus preferencias,
          idioma o ajustes de visualización.
        </li>
        <li>
          <strong>Analíticas:</strong> cookies de terceros usadas para medir
          estadísticas de uso y mejorar el servicio, siempre de forma
          anonimizada.
        </li>
      </ul>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Cookies de terceros
      </h2>
      <p>Este sitio puede usar cookies de terceros para servicios externos:</p>
      <ul className="list-disc ml-5 space-y-1">
        <li>Twitch OAuth — autenticación segura</li>
        <li>Groq API — generación de predicciones y análisis IA</li>
      </ul>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Duración de las cookies
      </h2>
      <p>
        Las cookies se almacenan durante distintos períodos según su finalidad:
      </p>
      <ul className="list-disc ml-5 space-y-1">
        <li>Sesión: hasta cerrar el navegador</li>
        <li>
          Persistentes: hasta 24 horas (predicciones, IA) o 1 año (preferencias)
        </li>
      </ul>

      <h2 className="text-white mt-6 mb-2 font-semibold">Consentimiento</h2>
      <p>
        Al navegar por este sitio web, aceptas el uso de cookies según esta
        política. Puedes revocar tu consentimiento en cualquier momento desde la
        configuración de cookies del navegador.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Cómo desactivar o eliminar cookies
      </h2>
      <p>
        Puedes bloquear o eliminar cookies desde la configuración de tu
        navegador. Ten en cuenta que algunas funciones del sitio podrían dejar
        de funcionar si lo haces.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">Contacto</h2>
      <p>
        Para cualquier duda sobre la política de cookies, contacta a Rubén Meju
        en{" "}
        <a href="mailto:rubenmeju@outlook.es" className="text-[#e63946]">
          rubenmeju@outlook.es
        </a>
      </p>
    </div>
  );
}
