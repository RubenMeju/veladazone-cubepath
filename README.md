# 🥊 VeladaZone

La plataforma definitiva para La Velada del Año 6. Predicciones con IA, estadísticas históricas, ligas fantasy, modo debate y tu cartel personalizado para compartir.

🌐 [Demo en vivo](https://laveladazone.duckdns.org) · 📺 La Velada del Año 6 — 25 Julio 2026

---

## ✨ Funcionalidades

- 🔐 **Login con Twitch** — entra con tu cuenta real en un clic, sin formularios
- 📊 **Stats & Historia** — historial completo de las 6 ediciones con stats, récords por luchador y análisis épico generado por IA
- 🎯 **Predicciones** — elige tu ganador en cada combate y recibe un comentario épico generado por IA (Groq + Llama 3.3)
- 🔮 **Predicción de la IA** — descubre qué luchador elegiría la propia IA en cada combate y por qué
- 🌡️ **Termómetro de la comunidad** — ve en tiempo real qué % de usuarios apoya a cada luchador
- 🎲 **La predicción más loca** — descubre qué apuesta sorprende más a la comunidad
- 🏅 **Sistema de badges** — sube de Novato 🥊 a Oráculo 🔮 según tus aciertos
- 🗡️ **Contador de traiciones** — la app recuerda cuántas veces has cambiado de bando
- 💬 **Modo Debate** — deja tu argumento defendiendo a tu luchador, responde a otros y vota los mejores
- 👤 **Perfil público** — perfil compartible con tus stats, predicciones y argumentos con contador de visitas
- 🧬 **ADN de predictor** — la IA analiza tus picks y genera un perfil único de tu personalidad como predictor
- ↗️ **Compartir predicción** — comparte tu pick de cada combate en X, WhatsApp, Telegram y Facebook
- 🃏 **Cartel personalizado** — genera y comparte tu cartel de predicciones para redes sociales
- 🏆 **Fantasy League** — crea ligas privadas con amigos, compite por puntos y sigue el ranking en tiempo real
- 🎙️ **Narración IA por edición** — la IA narra cada edición como si fuera la intro de un documental de boxeo
- 📱 **PWA instalable** — instala VeladaZone en tu móvil como una app nativa
- 🥊 **Animación de celebración** — al completar las 10 predicciones, dos guantes chocan en pantalla

---

## 🛠️ Stack

| Capa            | Tecnología                             |
| --------------- | -------------------------------------- |
| Frontend        | Next.js 16.2 + Tailwind CSS            |
| Backend         | Django 5 + Django REST Framework       |
| Base de datos   | PostgreSQL 16                          |
| Auth            | Twitch OAuth2 + JWT (cookies HttpOnly) |
| IA              | Groq API + Llama 3.3 70B               |
| Caché           | Redis 7 (VPS dedicado)                 |
| Infraestructura | 2× CubePath VPS gp.nano                |

---

## ⚡ Arquitectura Frontend

### SSR con streaming y HydrationBoundary

Las páginas públicas usan **Server Components con streaming** para maximizar rendimiento y SEO:

- El servidor prefetcha los datos públicos (`fights`, `community_stats`) en paralelo con `Promise.all`
- El cache de React Query se serializa en el HTML vía `HydrationBoundary` + `dehydrate()` — el cliente hereda los datos **con timestamps correctos**, sin ningún fetch extra en el mount
- El header de la página llega al browser **inmediatamente** vía streaming; `Suspense` muestra un skeleton mientras los fetches resuelven
- Los datos privados del usuario (predicciones, JWT) permanecen como Client Component porque dependen de cookies HttpOnly

```
0ms   → Header visible (streaming SSR)
0ms   → Skeleton bajo el header (Suspense fallback)
~20ms → Datos reales desde Redis cache
```

### Separación cliente / servidor

```
page.tsx (Server Component)
  ├── Header — SSR puro, llega inmediatamente
  └── Suspense fallback={<Skeleton />}
        └── PrediccionesData (Server Component async)
              └── HydrationBoundary (cache serializado)
                    └── PrediccionesClient (Client Component)
                          ├── fights        ← cache hidratado, 0 fetches
                          ├── community_stats ← cache hidratado, refresca cada 30s
                          └── my-predictions ← solo client (cookie JWT)
```

### Perfil público con Open Graph dinámico

`/perfil/[username]` usa `generateMetadata` para generar tags Open Graph con los datos reales del usuario (nombre, badge, % de acierto). Cuando alguien comparte un perfil en X o WhatsApp, el preview muestra información real en lugar del título genérico de la app.

### Resolución dinámica de upstream en Nginx

Nginx usa `set $upstream` + `resolver 127.0.0.11` para re-resolver los nombres de servicio Docker cada 30 segundos. Esto evita el error `502 Bad Gateway` que ocurre cuando un contenedor se reinicia y obtiene una nueva IP — sin esta configuración, Nginx cachea la IP al arrancar y pierde la conexión si el backend se reinicia.

---

## 🖥️ Infraestructura en CubePath

El proyecto usa dos VPS gp.nano de CubePath en Barcelona:

| Servidor | Contenido                                           |
| -------- | --------------------------------------------------- |
| VPS 1    | Django + PostgreSQL + Next.js + Nginx + HTTPS       |
| VPS 2    | Redis 7 — caché de respuestas IA y datos frecuentes |

### Qué cachea Redis

| Dato                            | TTL   |
| ------------------------------- | ----- |
| Análisis IA de cada luchador    | 24h   |
| Predicciones IA de cada combate | 24h   |
| Narraciones IA de cada edición  | 24h   |
| Leaderboard global              | 5 min |
| Community stats / termómetro    | 1 min |
| Sesiones de usuario             | 24h   |

**Dominio:** `laveladazone.duckdns.org` con certificado SSL (Let's Encrypt)

### Firewall VPS 1

| Puerto | Protocolo | Origen    |
| ------ | --------- | --------- |
| 22     | TCP       | 0.0.0.0/0 |
| 80     | TCP       | 0.0.0.0/0 |
| 443    | TCP       | 0.0.0.0/0 |

### Firewall VPS 2

| Puerto | Protocolo | Origen       |
| ------ | --------- | ------------ |
| 22     | TCP       | 0.0.0.0/0    |
| 6379   | TCP       | IP_VPS1_ONLY |

### Rate Limiting (Nginx)

| Zona           | Endpoints                                | Límite     | Burst |
| -------------- | ---------------------------------------- | ---------- | ----- |
| `ai_endpoints` | Análisis IA, predicción IA, narración IA | 15 req/min | 8     |
| `post_actions` | Predicciones, votos, debate              | 40 req/min | 25    |
| `auth`         | Login, OAuth                             | 12 req/min | 15    |
| `general`      | Resto de la API                          | 80 req/min | 35    |

Los endpoints de IA tienen el límite más estricto al implicar llamadas externas a Groq (coste por uso). Todas las requests que superen el límite reciben un `429 Too Many Requests`.

### Optimizaciones de producción

Gunicorn está configurado con 3 workers gthread (óptimo para 1 vCPU / 2 GB RAM), 2 threads por worker y reinicio periódico de workers para evitar memory leaks:

```
workers=3, worker-class=gthread, threads=2, max-requests=1000
```

Sesiones almacenadas en Redis en lugar de base de datos para mayor velocidad y compatibilidad con OAuth en móvil.

Login con Twitch en móvil implementado mediante popup para evitar el problema de cambio de contexto entre navegadores en Android. Incluye un backend personalizado (`TwitchOAuth2Mobile`) que permite el flujo OAuth aunque el navegador cambie durante el redirect.

---

## 🚀 Desarrollo local

### Requisitos

- Docker y Docker Compose
- Cuenta en [dev.twitch.tv](https://dev.twitch.tv) para credenciales OAuth
- API Key de Groq (gratuita)

### Variables de entorno

```env
SECRET_KEY=tu_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=veladazone
DB_USER=veladazone
DB_PASSWORD=veladazone
DB_HOST=db
TWITCH_CLIENT_ID=tu_twitch_client_id
TWITCH_CLIENT_SECRET=tu_twitch_client_secret
GROQ_API_KEY=tu_groq_key
FRONTEND_URL=http://localhost:3000
REDIS_HOST=localhost       # opcional en local
REDIS_PASSWORD=            # opcional en local
```

> **Nota:** No definir `BACKEND_URL` en local. Esta variable solo existe en producción (Docker Compose) apuntando a la red interna: `http://backend:8000`.

### Pasos

```bash
# 1. Clona el repo
git clone https://github.com/RubenMeju/veladazone-cubepath
cd veladazone-cubepath

# 2. Configura las variables de entorno
cp backend/.env.example backend/.env
# Edita backend/.env con tus credenciales

# 3. Levanta todo con Docker
docker compose up -d

# 4. Ejecuta las migraciones
docker compose exec backend python manage.py migrate --settings=veladazone.settings.dev

# 5. Carga los datos iniciales (6 ediciones + 60 luchadores + combates)
docker compose exec backend python manage.py loaddata fixtures/initial_data.json --settings=veladazone.settings.dev

# 6. Abre la app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
# Admin: http://localhost:8000/admin
```

> **Tip para desarrollo:** Puedes levantar solo el backend con Docker y correr el frontend en local para hot reload instantáneo:
>
> ```bash
> docker compose up -d db backend
> cd frontend && npm run dev
> ```

---

## 🌐 Despliegue en CubePath

```bash
# En el VPS 1 de CubePath
git clone https://github.com/RubenMeju/veladazone-cubepath
cd veladazone-cubepath

# Configura las variables de entorno
cp backend/.env.example backend/.env
nano backend/.env  # añade credenciales de producción (incluye REDIS_HOST y REDIS_PASSWORD)

# Crea el .env raíz con variables de Docker Compose
nano .env  # DB_NAME, DB_USER, DB_PASSWORD, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BACKEND_URL

# Levanta todos los servicios
docker compose -f docker-compose.prod.yml up -d --build

# Migraciones y datos
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=veladazone.settings.prod
docker compose -f docker-compose.prod.yml exec backend python manage.py loaddata fixtures/initial_data.json --settings=veladazone.settings.prod

# HTTPS con Certbot (Let's Encrypt)
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email tu@email.com --agree-tos -d tudominio.com
```

### VPS 2 — Redis

```bash
curl -fsSL https://get.docker.com | sh

docker run -d \
  --name redis \
  --restart always \
  -p 6379:6379 \
  redis:7-alpine \
  redis-server --requirepass "tu_password"
```

### Variables de producción (docker-compose.prod.yml)

```yaml
frontend:
  environment:
    BACKEND_URL: http://backend:8000 # red interna Docker para SSR
```

---

## 📡 API Endpoints

| Método | Endpoint                                      | Auth | Descripción                            |
| ------ | --------------------------------------------- | ---- | -------------------------------------- |
| GET    | `/api/v1/fighters/list/`                      | No   | Lista de luchadores                    |
| GET    | `/api/v1/fighters/list/?edition={n}`          | No   | Luchadores por edición                 |
| GET    | `/api/v1/fighters/editions/`                  | No   | Historial de ediciones                 |
| GET    | `/api/v1/fighters/fights/?edition=6`          | No   | Combates de la edición 6               |
| GET    | `/api/v1/fighters/{id}/analysis/`             | No   | Análisis IA de un luchador (cacheado)  |
| GET    | `/api/v1/fighters/fights/{id}/ai-prediction/` | No   | Predicción IA de un combate (cacheado) |
| GET    | `/api/v1/fighters/editions/{n}/summary/`      | No   | Narración IA de una edición (cacheado) |
| GET    | `/api/v1/predictions/leaderboard/`            | No   | Ranking global con badges (cacheado)   |
| GET    | `/api/v1/predictions/community_stats/`        | No   | % votos por combate (cacheado)         |
| POST   | `/api/v1/predictions/`                        | ✅   | Crear/actualizar predicción            |
| GET    | `/api/v1/predictions/betrayals/`              | ✅   | Contador de traiciones                 |
| GET    | `/api/v1/predictions/arguments/?fight={id}`   | No   | Argumentos por combate                 |
| POST   | `/api/v1/predictions/arguments/`              | ✅   | Crear/editar argumento                 |
| POST   | `/api/v1/predictions/arguments/{id}/vote/`    | ✅   | Votar/desvotar argumento               |
| POST   | `/api/v1/predictions/arguments/{id}/reply/`   | ✅   | Responder a argumento                  |
| GET    | `/api/v1/users/me/`                           | ✅   | Perfil del usuario                     |
| GET    | `/api/v1/users/me/stats/`                     | ✅   | Stats y badge del usuario              |
| GET    | `/api/v1/users/me/dna/`                       | ✅   | ADN de predictor generado por IA       |
| GET    | `/api/v1/users/profile/{username}/`           | No   | Perfil público de usuario              |
| POST   | `/api/v1/users/token/refresh/`                | No   | Refresh del JWT                        |
| POST   | `/api/v1/fantasy/leagues/`                    | ✅   | Crear liga                             |
| POST   | `/api/v1/fantasy/leagues/join/`               | ✅   | Unirse a liga                          |
| GET    | `/api/v1/fantasy/leagues/{id}/leaderboard/`   | ✅   | Ranking de liga                        |

---

## 🏗️ Estructura del proyecto

```
veladazone-cubepath/
├── backend/                          # Django API
│   ├── veladazone/
│   │   ├── apps/
│   │   │   ├── users/                # Auth + Twitch OAuth + JWT cookies + perfil + ADN IA
│   │   │   │   └── backends.py       # Backend Twitch personalizado para OAuth en móvil
│   │   │   ├── fighters/             # Luchadores, ediciones, combates + análisis IA + caché Redis
│   │   │   ├── predictions/          # Predicciones + IA + badges + traiciones + debate + caché Redis
│   │   │   └── fantasy/              # Ligas fantasy + ranking
│   │   └── settings/
│   │       ├── base.py               # Redis cache + sesiones + cookies config
│   │       ├── dev.py
│   │       └── prod.py
│   ├── fixtures/
│   │   └── initial_data.json         # 6 ediciones + 60 luchadores + combates
│   └── Dockerfile
├── frontend/                         # Next.js 16.2
│   ├── public/
│   │   ├── manifest.json             # PWA manifest
│   │   └── icons/                    # Iconos PWA
│   └── src/
│       └── app/
│           ├── page.tsx              # Home + countdown
│           ├── stats/                # Historial + análisis IA + narración IA
│           ├── predicciones/         # SSR + streaming + HydrationBoundary
│           │   ├── page.tsx          # Server Component — prefetch + Suspense
│           │   ├── PrediccionesClient.tsx  # Client Component — interactividad
│           │   ├── loading.tsx       # Skeleton para navegaciones lentas
│           │   └── components/
│           │       ├── debate/       # Modo debate
│           │       ├── AIPrediction.tsx
│           │       ├── DNAPredictor.tsx
│           │       ├── ShareFightButton.tsx
│           │       └── CompletionCelebration.tsx
│           ├── perfil/
│           │   └── [username]/       # SSR + Open Graph dinámico
│           │       ├── page.tsx      # generateMetadata + Suspense
│           │       ├── ProfileClient.tsx   # Server Component orquestador
│           │       ├── types.ts
│           │       └── components/
│           │           ├── ProfileSkeleton.tsx
│           │           ├── ProfileHeader.tsx
│           │           ├── ProfileStats.tsx
│           │           ├── ProfilePredictions.tsx
│           │           ├── ProfileArguments.tsx
│           │           ├── ProfileLeagues.tsx
│           │           └── ShareProfileButton.tsx  # único "use client"
│           ├── fantasy/              # Ligas fantasy
│           └── mi-cartel/            # Cartel personalizado
├── lib/
│   ├── api.ts                        # Fetch client para browser (credentials: include)
│   └── api.server.ts                 # Fetch helper exclusivo para Server Components
├── docker-compose.yml                # Desarrollo local
├── docker-compose.prod.yml           # Producción CubePath VPS 1
└── nginx.prod.conf                   # Proxy reverso + HTTPS + Rate Limiting + resolver dinámico
```

---

## 📸 Capturas

_Añadir capturas o GIFs de la app en funcionamiento_

---

Hecho con ❤️ para la comunidad de midudev · Hackatón CubePath 2026
