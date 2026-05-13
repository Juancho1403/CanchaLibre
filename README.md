# CanchaYa / Reserva tu cancha

## De qué trata

**CanchaYa** es una aplicación web para **reservar canchas de fútbol (y gestionar complejos deportivos)**. Los **socios** exploran empresas y canchas, eligen día y horario, reservan y pueden pagar con integraciones de prueba (Stripe, PayPal, Mercado Pago). Los **propietarios** administran su complejo, canchas, precios y confirman o cancelan reservas. Los **administradores** gestionan usuarios, empresas, canchas y ven un resumen operativo. Incluye además un tablón de **comunidad** (partidos abiertos para sumarse o publicar cupos).

Stack principal: **Node.js + Express + Sequelize** (SQLite por defecto) en el backend, **React + Vite + Tailwind** en el frontend.

---

## Requisitos

- [Node.js](https://nodejs.org/) **18+** recomendado (el proyecto se ha probado con Node 20/22).
- npm (incluido con Node).

---

## Cómo correr el proyecto

Hay **dos procesos**: la API en `backend` y la web en `frontend`. Conviene **dos terminales**.

### 1. Backend (API)

```bash
cd backend
npm install
npm start
```

Por defecto el servidor escucha en **`http://localhost:3001`**.

- La base **SQLite** se crea/usa en `backend/database.sqlite` (configurable con `DB_STORAGE` en `.env`).
- Al arrancar, Sequelize sincroniza modelos y se ejecuta un **seed** si la base está vacía (usuarios y datos demo).
- Si ves el error **`EADDRINUSE`** en el puerto 3001, ya hay otro proceso usando ese puerto: cerrá la otra terminal o liberá el puerto antes de volver a iniciar.

Creá o editá **`backend/.env`** según necesites (copiá desde un ejemplo propio; no subas secretos al repositorio). Variables útiles:

| Variable | Descripción |
|----------|-------------|
| `SERVER_PORT` | Puerto de la API (default `3001`). |
| `TOKEN_KEY` | Clave para firmar JWT de sesión. |
| `FRONTEND_URL` | URL del front (ej. `http://localhost:5173`) para pagos y retornos. |
| `DB_DIALECT` / `DB_STORAGE` | SQLite por defecto; podés apuntar a Postgres si lo configurás. |
| `STRIPE_SECRET_KEY`, `PAYPAL_*`, `MERCADOPAGO_KEY` | Opcionales; sin ellas el checkout digital puede mostrar avisos de configuración. |

### 2. Frontend (web)

```bash
cd frontend
npm install
npm run dev
```

Vite suele levantar en **`http://localhost:5173`**.

Opcional en **`frontend/.env`** (o `.env.local`):

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | Base de la API si no usás `http://localhost:3001/api`. |
| `VITE_USE_LOCAL_STORAGE` | Si es `true`, el front usa datos en **localStorage** sin llamar a la API (modo demo offline). |

Con la API real, dejá `VITE_USE_LOCAL_STORAGE` sin definir o en `false`.

### 3. Producción (solo front estático)

```bash
cd frontend
npm run build
npm run preview
```

El comando `build` genera la carpeta `frontend/dist`.

---

## Usuarios de prueba (seed típico)

Tras el primer arranque con base vacía suelen crearse cuentas demo; revisá la consola del backend al hacer seed. Ejemplos habituales documentados en el proyecto:

- **Administrador:** credenciales configuradas en el seed (suele ser usuario tipo `admin`).
- **Socio** y **propietario:** emails de prueba tipo `socio@test.com` / `propietario@test.com` con contraseñas del seed.
- **Camp Nou (Barcelona):** puede existir un propietario demo asociado al complejo Spotify Camp Nou (ver mensajes del seed en consola).

Si ya tenías datos en `database.sqlite`, el seed no vuelve a crear usuarios duplicados; podés borrar el archivo para regenerar todo (solo en desarrollo).

---

## Estructura del repositorio

```
reservaTuCancha/
├── backend/          # API Express, Sequelize, SQLite
├── frontend/         # React + Vite + Tailwind
└── README.md
```

---

## Más ayuda

- Asegurate de que el front apunte al mismo origen que acepta CORS en la API (`CORS_ORIGIN` / `FRONTEND_URL` en el backend).
- Para problemas de pago Mercado Pago con `auto_return`, usá `FRONTEND_URL` con **HTTPS** en producción; en local el backend omite `auto_return` si la URL de éxito no es HTTPS.
