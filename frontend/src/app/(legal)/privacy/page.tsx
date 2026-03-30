export default function PrivacyPage() {
  return (
    <div className="page-container max-w-3xl mx-auto py-16 text-sm text-gray-400">
      <h1 className="text-3xl text-white mb-6 font-bold">
        Política de Privacidad
      </h1>

      <p className="mb-4">
        Esta política describe cómo se recogen y utilizan los datos personales
        de los usuarios en este sitio web.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Responsable del tratamiento
      </h2>
      <p>Responsable: Rubén Meju</p>
      <p>Email: rubenmeju@outlook.es</p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Datos que recogemos
      </h2>
      <ul className="list-disc ml-5 space-y-1">
        <li>Nombre de usuario de Twitch</li>
        <li>ID de usuario proporcionado por Twitch</li>
        <li>Datos de uso dentro de la plataforma (predicciones, actividad)</li>
      </ul>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Finalidad del tratamiento
      </h2>
      <p>
        Los datos se utilizan para permitir el acceso a la plataforma, gestionar
        la cuenta del usuario, mostrar estadísticas personalizadas y mejorar la
        experiencia dentro del sitio web.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">Base legal</h2>
      <p>
        El tratamiento de los datos se basa en el consentimiento del usuario al
        iniciar sesión mediante Twitch OAuth, así como en la ejecución del
        servicio solicitado.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Conservación de los datos
      </h2>
      <p>
        Los datos se conservarán mientras el usuario mantenga su cuenta activa o
        hasta que solicite su eliminación.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Almacenamiento y seguridad
      </h2>
      <p>
        Los datos se almacenan en servidores privados y se protegen mediante
        medidas de seguridad adecuadas. Las sesiones se gestionan mediante
        cookies seguras (HttpOnly).
      </p>

      {/* 🔥 MUY IMPORTANTE */}
      <h2 className="text-white mt-6 mb-2 font-semibold">
        Servicios de terceros
      </h2>
      <p>
        Este sitio utiliza servicios externos necesarios para su funcionamiento:
      </p>
      <ul className="list-disc ml-5 space-y-1">
        <li>Twitch (autenticación OAuth)</li>
        <li>Groq (generación de contenido mediante IA)</li>
      </ul>
      <p className="mt-2">
        Estos servicios pueden procesar datos conforme a sus propias políticas
        de privacidad.
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">Cesión de datos</h2>
      <p>
        No se venden ni ceden datos personales a terceros, salvo obligación
        legal.
      </p>

      {/* 🔥 CLAVE RGPD */}
      <h2 className="text-white mt-6 mb-2 font-semibold">
        Derechos del usuario
      </h2>
      <p>
        El usuario puede ejercer sus derechos de acceso, rectificación,
        eliminación y limitación del tratamiento enviando una solicitud a:
        rubenmeju@outlook.es
      </p>

      <h2 className="text-white mt-6 mb-2 font-semibold">
        Cambios en la política
      </h2>
      <p>
        El titular se reserva el derecho a modificar esta política para
        adaptarla a novedades legislativas o cambios en el servicio.
      </p>
    </div>
  );
}
