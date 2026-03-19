# 🥊 VeladaZone

La plataforma definitiva para La Velada del Año 6. Predicciones, estadísticas históricas y ligas fantasy con tu comunidad de Twitch.

**[🌐 Demo en vivo](https://veladazone.com)** · **[📺 La Velada del Año 6 — 25 Julio 2026](https://twitch.tv)**

---

## ✨ Funcionalidades

- **🔐 Login con Twitch** — entra con tu cuenta real, sin formularios
- **📊 Stats & Historia** — historial completo de las 6 ediciones con stats por luchador
- **🎯 Predicciones** — elige tu ganador en cada combate y recibe un comentario épico generado por IA
- **🃏 Cartel personalizado** — genera y comparte tu cartel de predicciones listo para redes sociales
- **🏆 Fantasy League** — crea ligas privadas con amigos y compite por puntos

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | Django 5 + Django REST Framework |
| Base de datos | PostgreSQL 16 |
| Auth | Twitch OAuth2 + JWT |
| IA | Google Gemini 2.0 Flash |
| Infraestructura | CubePath VPS |

## 🚀 Desarrollo local

### Requisitos
- Docker y Docker Compose
- Cuenta en [dev.twitch.tv](https://dev.twitch.tv) para credenciales OAuth
- API Key de [Google AI Studio](https://aistudio.google.com)

### Pasos

```bash
# 1. Clona el repo
git clone https://github.com/tu-usuario/veladazone
cd veladazone

# 2. Configura las variables de entorno
cp backend/.env.example backend/.env
# Edita backend/.env con tus credenciales

# 3. Levanta todo con Docker
docker-compose up -d

# 4. Ejecuta las migraciones
docker-compose exec backend python manage.py migrate

# 5. Carga los datos iniciales
docker-compose exec backend python manage.py loaddata fixtures/initial_data.json

# 6. Abre la app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
# Admin: http://localhost:8000/admin
```

## 🖥️ Despliegue en CubePath

VPS 1 (gp.nano) — Backend + PostgreSQL + Nginx
VPS 2 (gp.nano) — Frontend Next.js

```bash
# En VPS 1
git clone https://github.com/tu-usuario/veladazone
cp backend/.env.example backend/.env
# Edita .env con credenciales de producción
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/fighters/list/` | Lista de luchadores |
| GET | `/api/v1/fighters/editions/` | Historial de ediciones |
| GET | `/api/v1/fighters/fights/?edition=6` | Combates de la edición 6 |
| GET | `/api/v1/predictions/leaderboard/` | Ranking global |
| POST | `/api/v1/predictions/` | Crear predicción |
| POST | `/api/v1/fantasy/leagues/` | Crear liga |
| POST | `/api/v1/fantasy/leagues/join/` | Unirse a liga |

## 🏗️ Estructura del proyecto

```
veladazone/
├── backend/               # Django API
│   ├── veladazone/
│   │   ├── apps/
│   │   │   ├── users/     # Auth + Twitch OAuth
│   │   │   ├── fighters/  # Luchadores, ediciones, combates
│   │   │   ├── predictions/ # Predicciones + IA
│   │   │   └── fantasy/   # Ligas fantasy
│   │   └── settings/
│   └── Dockerfile
├── frontend/              # Next.js
│   └── Dockerfile
├── docker-compose.yml     # Desarrollo local
├── docker-compose.prod.yml # Producción CubePath
└── nginx.conf
```

---

Hecho con ❤️ para la comunidad de [midudev](https://twitch.tv/midudev) · Hackatón CubePath 2026
