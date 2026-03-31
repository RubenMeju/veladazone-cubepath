# 🥊 VeladaZone

> La plataforma definitiva para vivir La Velada del Año 6 como nunca antes.

Predice, debate, compite y comparte — todo con tu cuenta de Twitch, todo con IA.

🌐 **[laveladazone.com](https://laveladazone.com)** · 📺 La Velada del Año 6 — 25 Julio 2026

---

## ¿Qué es VeladaZone?

VeladaZone convierte el hype de La Velada en una experiencia interactiva completa. Los fans entran con su cuenta de Twitch, eligen sus ganadores, reciben un comentario épico generado por IA, debaten con otros usuarios y compiten en el ranking global.

El día del evento, cada predicción acertada sube en el ranking. Cada traición queda registrada. Cada badge ganado se puede presumir.

---

## ✨ Funcionalidades

|     | Funcionalidad              | Descripción                                                            |
| --- | -------------------------- | ---------------------------------------------------------------------- |
| 🔐  | **Login con Twitch**       | Un clic. Sin formularios.                                              |
| 🎯  | **Predicciones con IA**    | Elige tu ganador y recibe un comentario épico generado por Llama 3.3   |
| 🔮  | **Predicción de la IA**    | Descubre qué luchador elegiría la propia IA y por qué                  |
| 🌡️  | **Termómetro comunidad**   | Ve en tiempo real qué % de usuarios apoya a cada luchador              |
| 🏅  | **Sistema de badges**      | De Novato 🥊 a Oráculo 🔮 según tus aciertos históricos                |
| 🗡️  | **Contador de traiciones** | La app recuerda cuántas veces has cambiado de bando                    |
| 💬  | **Modo Debate**            | Defiende a tu luchador, responde y vota los mejores argumentos         |
| 🧬  | **ADN de predictor**       | La IA analiza tu historial y genera un perfil único de tu personalidad |
| 🃏  | **Cartel personalizado**   | Genera y comparte tu cartel de predicciones en redes sociales          |
| 🏆  | **Fantasy League**         | Ligas privadas con amigos, ranking en tiempo real                      |
| 👤  | **Perfil público**         | Perfil compartible con stats, predicciones y contador de visitas       |
| 📊  | **Stats & Historia**       | Historial completo de las 6 ediciones con análisis IA por luchador     |
| 🎙️  | **Narración IA**           | La IA narra cada edición como la intro de un documental de boxeo       |
| 📱  | **PWA instalable**         | Funciona como app nativa en móvil, sin pasar por ninguna tienda        |
| 🥊  | **Celebración**            | Al completar las 10 predicciones, dos guantes chocan en pantalla       |

---

## 🛠️ Stack

| Capa            | Tecnología                               |
| --------------- | ---------------------------------------- |
| Frontend        | Next.js 16.2 + React 19 + Tailwind CSS 4 |
| Backend         | Django 5 + Django REST Framework         |
| Base de datos   | PostgreSQL 16                            |
| Auth            | Twitch OAuth2 + JWT (cookies HttpOnly)   |
| IA              | Groq API + Llama 3.3 70B                 |
| Caché           | Redis 7 (VPS dedicado)                   |
| Infraestructura | 2× CubePath VPS gp.nano (Barcelona)      |

---

## ⚡ Arquitectura

### SSR con streaming

Las páginas públicas usan Server Components con streaming — el contenido llega al navegador en milisegundos desde Redis, sin esperar a que termine el fetch completo.

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
                          ├── fights          ← cache hidratado, 0 fetches
                          ├── community_stats ← refresca cada 30s
                          └── my-predictions  ← solo client (cookie JWT)
```

### Ranking — SSR puro + scroll infinito

El Server Component fetcha los primeros 50 resultados y los pasa como props. El Client Component gestiona el scroll infinito con `IntersectionObserver` para páginas adicionales. Sin React Query, sin hidratación, sin flash de carga.

### Login con Twitch — redirect completo

Sin popups, sin polling. Redirect OAuth estándar que funciona en cualquier navegador. En Android la PWA usa un flujo alternativo (`TwitchOAuth2Mobile`) con tokens en URL para sobrevivir el cambio de contexto entre apps.

### Nginx — resolución dinámica de upstream

Usa `set $upstream` + `resolver 127.0.0.11` para re-resolver los servicios Docker cada 30 segundos. Evita el `502 Bad Gateway` cuando un contenedor se reinicia y cambia de IP.

---

## 🖥️ Infraestructura en CubePath

| Servidor | Contenido                                           |
| -------- | --------------------------------------------------- |
| VPS 1    | Django + PostgreSQL + Next.js + Nginx + HTTPS       |
| VPS 2    | Redis 7 — caché de respuestas IA y datos frecuentes |

### Caché Redis

| Dato                            | TTL   |
| ------------------------------- | ----- |
| Análisis IA de cada luchador    | 24h   |
| Predicciones IA de cada combate | 24h   |
| Narraciones IA de cada edición  | 24h   |
| Leaderboard global              | 5 min |
| Community stats / termómetro    | 1 min |
| Sesiones de usuario             | 24h   |

### Rate Limiting (Nginx)

| Zona           | Endpoints                                | Límite     | Burst |
| -------------- | ---------------------------------------- | ---------- | ----- |
| `ai_endpoints` | Análisis IA, predicción IA, narración IA | 15 req/min | 8     |
| `post_actions` | Predicciones, votos, debate              | 40 req/min | 25    |
| `auth`         | Login, OAuth                             | 12 req/min | 15    |
| `general`      | Resto de la API                          | 80 req/min | 35    |

### Producción

Gunicorn configurado con 3 workers gthread (óptimo para 1 vCPU / 2 GB RAM), 2 threads por worker y reinicio periódico para evitar memory leaks:

```
workers=3, worker-class=gthread, threads=2, max-requests=1000
```

---

## 🚀 Desarrollo local

### Requisitos

- Docker y Docker Compose
- Cuenta en [dev.twitch.tv](https://dev.twitch.tv) para credenciales OAuth
- API Key de Groq (gratuita en [console.groq.com](https://console.groq.com))

### Variables de entorno

```env
# backend/.env
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
# REDIS_HOST y REDIS_PASSWORD son opcionales en local
```

> `BACKEND_URL` solo existe en producción apuntando a la red interna Docker: `http://backend:8000`. No la definas en local.

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

# 4. Migraciones y datos iniciales
docker compose exec backend python manage.py migrate --settings=veladazone.settings.dev
docker compose exec backend python manage.py loaddata fixtures/initial_data.json --settings=veladazone.settings.dev

# Frontend: http://localhost:3000
# API:      http://localhost:8000/api/v1
# Admin:    http://localhost:8000/admin
```

> **Tip:** Para hot reload instantáneo en el frontend, levanta solo el backend con Docker y corre Next.js en local:
>
> ```bash
> docker compose up -d db backend
> cd frontend && npm run dev
> ```

---

## 🌐 Despliegue en producción

```bash
# En el VPS
git clone https://github.com/RubenMeju/veladazone-cubepath
cd veladazone-cubepath

# Variables de entorno
cp backend/.env.example backend/.env
nano backend/.env   # credenciales de producción
nano .env           # DB_NAME, DB_USER, DB_PASSWORD, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_GA_ID

# Levantar con nginx temporal para obtener el certificado SSL
# (ver nginx.temp.conf en el repo)
docker compose -f docker-compose.prod.yml up -d --build

# Certificado SSL (todos los dominios)
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email tu@email.com --agree-tos \
  -d laveladazone.com -d www.laveladazone.com \
  -d laveladazone.es -d laveladazone.info -d laveladazone.store

# Activar nginx de producción y recargar
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Migraciones y datos
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=veladazone.settings.prod
docker compose -f docker-compose.prod.yml exec backend python manage.py loaddata fixtures/initial_data.json --settings=veladazone.settings.prod
```

### Renovación automática del certificado

```bash
crontab -e
# Añadir:
0 3 * * * cd /root/veladazone-cubepath && docker compose -f docker-compose.prod.yml run --rm certbot renew --quiet && docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## 📡 API — endpoints principales

| Método | Endpoint                                      | Auth | Descripción                 |
| ------ | --------------------------------------------- | ---- | --------------------------- |
| GET    | `/api/v1/fighters/fights/?edition=6`          | No   | Combates de la edición 6    |
| GET    | `/api/v1/fighters/{id}/analysis/`             | No   | Análisis IA de un luchador  |
| GET    | `/api/v1/fighters/fights/{id}/ai-prediction/` | No   | Predicción IA de un combate |
| GET    | `/api/v1/predictions/leaderboard/`            | No   | Ranking global con badges   |
| GET    | `/api/v1/predictions/community_stats/`        | No   | % votos por combate         |
| POST   | `/api/v1/predictions/`                        | ✅   | Crear/actualizar predicción |
| GET    | `/api/v1/predictions/betrayals/`              | ✅   | Contador de traiciones      |
| GET    | `/api/v1/predictions/arguments/?fight={id}`   | No   | Argumentos del debate       |
| GET    | `/api/v1/users/me/`                           | ✅   | Perfil del usuario          |
| GET    | `/api/v1/users/me/dna/`                       | ✅   | ADN de predictor (IA)       |
| GET    | `/api/v1/users/profile/{username}/`           | No   | Perfil público              |
| POST   | `/api/v1/fantasy/leagues/`                    | ✅   | Crear liga                  |
| GET    | `/api/v1/fantasy/leagues/{id}/leaderboard/`   | ✅   | Ranking de liga             |

---

## 🏗️ Estructura del proyecto

```
veladazone-cubepath/
├── backend/                          # Django API
│   ├── apps/
│   │   ├── users/                    # Auth + Twitch OAuth + perfil + ADN IA
│   │   │   └── backends.py           # TwitchOAuth2Mobile — flujo PWA Android
│   │   ├── fighters/                 # Luchadores, combates, análisis IA + Redis
│   │   ├── predictions/              # Predicciones, badges, traiciones, debate + Redis
│   │   └── fantasy/                  # Ligas fantasy + ranking
│   ├── settings/
│   │   ├── base.py                   # Redis + sesiones + cookies
│   │   ├── dev.py
│   │   └── prod.py
│   ├── fixtures/
│   │   └── initial_data.json         # 6 ediciones + 60 luchadores + combates
│   └── Dockerfile
├── frontend/                         # Next.js 16.2
│   ├── public/
│   │   ├── og-image.webp             # Open Graph image (1200×630)
│   │   ├── manifest.json             # PWA manifest
│   │   └── icons/                    # Iconos PWA
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Home + countdown
│       │   ├── sitemap.ts            # Sitemap automático
│       │   ├── robots.ts             # robots.txt
│       │   ├── auth/callback/        # Callback OAuth (navegador + PWA)
│       │   ├── predicciones/         # SSR + streaming + HydrationBoundary
│       │   │   ├── ranking/          # SSR puro + scroll infinito cliente
│       │   │   └── components/       # Debate, IA, cartel, celebración
│       │   ├── perfil/[username]/    # SSR + Open Graph dinámico
│       │   ├── stats/                # Historial + análisis IA + narración IA
│       │   ├── fantasy/              # Ligas fantasy
│       │   └── mi-cartel/            # Cartel personalizado
│       ├── components/
│       │   ├── providers/            # QueryProvider, AnalyticsProvider
│       │   └── ui/                   # Navbar, Footer, etc.
│       ├── lib/
│       │   ├── api.ts                # Fetch client browser (credentials: include)
│       │   └── api.server.ts         # Fetch helper Server Components
│       └── stores/
│           └── authStore.ts          # Zustand persist — estado de auth
├── docker-compose.yml                # Desarrollo local
├── docker-compose.prod.yml           # Producción
└── nginx.prod.conf                   # HTTPS + rate limiting + resolver dinámico
```

---

## 📸 Capturas

_Añadir capturas o GIFs de la app en funcionamiento_

---

<div align="center">

Hecho con ❤️ para la comunidad de midudev · Hackatón CubePath 2026

</div>
