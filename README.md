# 🥊 VeladaZone

La plataforma definitiva para La Velada del Año 6. Predicciones con IA, estadísticas históricas, ligas fantasy, modo debate y tu cartel personalizado para compartir.

**[🌐 Demo en vivo](https://laveladazone.duckdns.org)** · **[📺 La Velada del Año 6 — 25 Julio 2026](https://twitch.tv)**

---

## ✨ Funcionalidades

- **🔐 Login con Twitch** — entra con tu cuenta real en un clic, sin formularios
- **📊 Stats & Historia** — historial completo de las 6 ediciones con stats, récords por luchador y análisis épico generado por IA
- **🎯 Predicciones** — elige tu ganador en cada combate y recibe un comentario épico generado por IA (Groq + Llama 3.3)
- **🔮 Predicción de la IA** — descubre qué luchador elegiría la propia IA en cada combate y por qué
- **🌡️ Termómetro de la comunidad** — ve en tiempo real qué % de usuarios apoya a cada luchador
- **🎲 La predicción más loca** — descubre qué apuesta sorprende más a la comunidad
- **🏅 Sistema de badges** — sube de Novato 🥊 a Oráculo 🔮 según tus aciertos
- **🗡️ Contador de traiciones** — la app recuerda cuántas veces has cambiado de bando
- **💬 Modo Debate** — deja tu argumento defendiendo a tu luchador, responde a otros y vota los mejores
- **👤 Perfil público** — perfil compartible con tus stats, predicciones y argumentos con contador de visitas
- **↗️ Compartir predicción** — comparte tu pick de cada combate en X, WhatsApp, Telegram y Facebook
- **🃏 Cartel personalizado** — genera y comparte tu cartel de predicciones para redes sociales
- **🏆 Fantasy League** — crea ligas privadas con amigos, compite por puntos y sigue el ranking en tiempo real

---

## 🛠️ Stack

| Capa            | Tecnología                             |
| --------------- | -------------------------------------- |
| Frontend        | Next.js 16.2 + Tailwind CSS            |
| Backend         | Django 5 + Django REST Framework       |
| Base de datos   | PostgreSQL 16                          |
| Auth            | Twitch OAuth2 + JWT (cookies HttpOnly) |
| IA              | Groq API + Llama 3.3 70B               |
| Infraestructura | CubePath VPS (gp.nano)                 |

---

## 🖥️ Infraestructura en CubePath

El proyecto está desplegado en **CubePath** usando un VPS gp.nano con todos los servicios orquestados con Docker Compose:

| Servicio        | Contenido                                                      |
| --------------- | -------------------------------------------------------------- |
| **VPS gp.nano** | Django + PostgreSQL + Next.js + Nginx + HTTPS                  |
| **Dominio**     | `laveladazone.duckdns.org` con certificado SSL (Let's Encrypt) |

### Firewall

El VPS tiene configurado un grupo de firewall en CubePath con las siguientes reglas de entrada:

| Puerto | Protocolo | Origen    |
| ------ | --------- | --------- |
| 22     | TCP       | 0.0.0.0/0 |
| 80     | TCP       | 0.0.0.0/0 |
| 443    | TCP       | 0.0.0.0/0 |

---

## 🚀 Desarrollo local

### Requisitos

- Docker y Docker Compose
- Cuenta en [dev.twitch.tv](https://dev.twitch.tv) para credenciales OAuth
- API Key de [Groq](https://console.groq.com) (gratuita)

### Variables de entorno necesarias

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
GEMINI_API_KEY=tu_gemini_key   # opcional, legacy
GROQ_API_KEY=tu_groq_key
FRONTEND_URL=http://localhost:3000
```

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

---

## 🌐 Despliegue en CubePath

```bash
# En el VPS de CubePath
git clone https://github.com/RubenMeju/veladazone-cubepath
cd veladazone-cubepath

# Configura las variables de entorno
cp backend/.env.example backend/.env
nano backend/.env  # añade credenciales de producción

# Crea el .env raíz con variables de Docker Compose
nano .env  # DB_NAME, DB_USER, DB_PASSWORD, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_BACKEND_URL

# Levanta todos los servicios
docker compose -f docker-compose.prod.yml up -d --build

# Migraciones y datos
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate --settings=veladazone.settings.prod
docker compose -f docker-compose.prod.yml exec backend python manage.py loaddata fixtures/initial_data.json --settings=veladazone.settings.prod

# HTTPS con Certbot (Let's Encrypt)
docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email tu@email.com --agree-tos -d tudominio.com
```

---

## 📡 API Endpoints

| Método | Endpoint                                      | Auth | Descripción                 |
| ------ | --------------------------------------------- | ---- | --------------------------- |
| GET    | `/api/v1/fighters/list/`                      | No   | Lista de luchadores         |
| GET    | `/api/v1/fighters/list/?edition={n}`          | No   | Luchadores por edición      |
| GET    | `/api/v1/fighters/editions/`                  | No   | Historial de ediciones      |
| GET    | `/api/v1/fighters/fights/?edition=6`          | No   | Combates de la edición 6    |
| GET    | `/api/v1/fighters/{id}/analysis/`             | No   | Análisis IA de un luchador  |
| GET    | `/api/v1/fighters/fights/{id}/ai-prediction/` | No   | Predicción IA de un combate |
| GET    | `/api/v1/predictions/leaderboard/`            | No   | Ranking global con badges   |
| GET    | `/api/v1/predictions/community_stats/`        | No   | % votos por combate         |
| POST   | `/api/v1/predictions/`                        | ✅   | Crear/actualizar predicción |
| GET    | `/api/v1/predictions/betrayals/`              | ✅   | Contador de traiciones      |
| GET    | `/api/v1/predictions/arguments/?fight={id}`   | No   | Argumentos por combate      |
| POST   | `/api/v1/predictions/arguments/`              | ✅   | Crear/editar argumento      |
| POST   | `/api/v1/predictions/arguments/{id}/vote/`    | ✅   | Votar/desvotar argumento    |
| POST   | `/api/v1/predictions/arguments/{id}/reply/`   | ✅   | Responder a argumento       |
| GET    | `/api/v1/users/me/`                           | ✅   | Perfil del usuario          |
| GET    | `/api/v1/users/me/stats/`                     | ✅   | Stats y badge del usuario   |
| GET    | `/api/v1/users/profile/{username}/`           | No   | Perfil público de usuario   |
| POST   | `/api/v1/users/token/refresh/`                | No   | Refresh del JWT             |
| POST   | `/api/v1/fantasy/leagues/`                    | ✅   | Crear liga                  |
| POST   | `/api/v1/fantasy/leagues/join/`               | ✅   | Unirse a liga               |
| GET    | `/api/v1/fantasy/leagues/{id}/leaderboard/`   | ✅   | Ranking de liga             |

---

## 🏗️ Estructura del proyecto

```
veladazone-cubepath/
├── backend/                    # Django API
│   ├── veladazone/
│   │   ├── apps/
│   │   │   ├── users/          # Auth + Twitch OAuth + JWT cookies + perfil público
│   │   │   ├── fighters/       # Luchadores, ediciones, combates + análisis IA
│   │   │   ├── predictions/    # Predicciones + IA + badges + traiciones + debate
│   │   │   └── fantasy/        # Ligas fantasy + ranking
│   │   └── settings/
│   │       ├── base.py
│   │       ├── dev.py
│   │       └── prod.py
│   ├── fixtures/
│   │   └── initial_data.json   # 6 ediciones + 60 luchadores + combates
│   └── Dockerfile
├── frontend/                   # Next.js 16.2
│   └── src/
│       └── app/
│           ├── page.tsx                    # Home + countdown
│           ├── stats/                      # Historial + análisis IA por luchador
│           │   └── components/             # FighterCard, FightRow, EditionInfo
│           ├── predicciones/               # Predicciones + termómetro + IA + debate
│           │   └── components/
│           │       ├── debate/             # Modo debate (ArgumentCard, ArgumentInput...)
│           │       ├── AIPrediction.tsx    # Predicción IA por combate
│           │       └── ShareFightButton.tsx # Compartir predicción en redes
│           ├── perfil/
│           │   └── [username]/             # Perfil público de usuario
│           ├── fantasy/                    # Ligas fantasy
│           └── mi-cartel/                  # Cartel personalizado
├── docker-compose.yml          # Desarrollo local
├── docker-compose.prod.yml     # Producción CubePath
└── nginx.prod.conf             # Proxy reverso + HTTPS
```

---

## 📸 Capturas

> _Añadir capturas o GIFs de la app en funcionamiento_

---

Hecho con ❤️ para la comunidad de [midudev](https://twitch.tv/midudev) · Hackatón CubePath 2026
