# Barrio Pizza — Reciclaje Inteligente

Sistema de fidelización que recompensa el reciclaje con puntos canjeables por cupones. Los clientes depositan basura en los basureros inteligentes, ganan EcoRewards y canjean cupones en Barrio Pizza.

## Stack

| Capa          | Tecnología                             |
| ------------- | -------------------------------------- |
| Backend       | Node.js + TypeScript + Express         |
| Base de datos | SQLite (via sql.js + TypeORM)          |
| Colas         | BullMQ + Redis (Docker)                |
| Frontend      | Next.js 14 + React 18 + Tailwind CSS 3 |
| Autenticación | JWT                                    |
| Tiempo real   | SSE (Server-Sent Events)               |

## Requisitos

- Node.js ≥ 18
- Docker Desktop (para Redis)
- npm

## Puerto por defecto

| Servicio           | Puerto |
| ------------------ | ------ |
| Backend (Express)  | `3000` |
| Frontend (Next.js) | `3001` |
| Redis              | `6379` |

## Setup

### 1. Instalar dependencias

```bash
# Desde la raíz del proyecto
npm install
cd src/frontend && npm install && cd ../..
```

### 2. Iniciar Redis

```bash
docker compose up -d
```

Verificar que esté corriendo:

```bash
docker ps
```

### 3. Poblar base de datos (seed)

```bash
npm run seed
```

Esto crea basureros, usuarios de prueba, cupones y logros.

### 4. Iniciar backend

```bash
npm run dev:backend
```

Deberías ver: `Backend corriendo en http://localhost:3000`

### 5. Iniciar frontend (otra terminal)

```bash
cd src/frontend
npm run dev
```

Si el puerto 3000 ya está ocupado por el backend, Next.js ofrecerá usar otro (ej. 3010). Abrí esa URL en el navegador.

## Cuentas de prueba

| Email              | Rol               |
| ------------------ | ----------------- |
| `cliente@test.com` | Cliente (186 pts) |
| `staff@test.com`   | Staff             |

Ambos se loguean solo con email (sin contraseña).

## Estructura del proyecto

```
BarrioPizzaMVP/
├── src/
│   ├── backend/           # API REST (Express + TypeORM)
│   │   ├── entities/      # Modelos de datos (Usuario, Basurero, Deposito, etc.)
│   │   ├── routes/        # Endpoints agrupados por rol
│   │   └── main.ts        # Punto de entrada del servidor
│   ├── frontend/          # PWA (Next.js + Tailwind)
│   │   └── src/
│   │       ├── app/       # Páginas (App Router)
│   │       │   ├── (auth)/auth        # Login / Registro
│   │       │   ├── (client)/          # Portal cliente (home, wallet, scan, map, history, profile)
│   │       │   └── (staff)/staff/     # Portal staff (validate, coupons, bins, achievements, reports)
│   │       ├── components/  # UI components (Button, Card, Input, Modal, etc.)
│   │       ├── context/     # AuthContext, ThemeContext
│   │       └── lib/         # Utilidades, API client
│   ├── shared/            # Código compartido backend+worker
│   │   ├── auth.ts        # Routes de auth + JWT middleware
│   │   ├── database.ts    # Configuración TypeORM + SQLite
│   │   ├── queue.ts       # Configuración BullMQ
│   │   ├── events.ts      # SSE handler
│   │   └── seed.ts        # Población inicial de datos
│   ├── worker/            # Procesador asíncrono (BullMQ)
│   │   └── main.ts        # Worker que calcula puntos y genera QRs
│   └── __tests__/         # Tests del backend
├── data/                  # Archivo SQLite (barriopizza.db)
├── docker-compose.yml     # Redis
└── package.json           # Scripts del monorepo
```

## Scripts disponibles

| Comando                           | Descripción                      |
| --------------------------------- | -------------------------------- |
| `npm run dev:backend`             | Inicia el backend con hot reload |
| `npm run dev:worker`              | Inicia el worker de colas        |
| `npm run seed`                    | Pobla la BD con datos iniciales  |
| `npm run build`                   | Compila TypeScript               |
| `npm run lint`                    | Linter                           |
| `npm run typecheck`               | Verificación de tipos            |
| `npm test`                        | Tests del backend (Vitest)       |
| `npm run test:frontend`           | Tests del frontend               |
| (en `src/frontend`) `npm run dev` | Inicia el frontend (Next.js)     |

## API — Endpoints principales

| Método | Ruta                            | Auth | Descripción                       |
| ------ | ------------------------------- | ---- | --------------------------------- |
| POST   | `/api/v1/auth/login`            | —    | Login por email                   |
| POST   | `/api/v1/auth/register`         | —    | Registro                          |
| GET    | `/api/v1/bins/locations`        | —    | Lista de basureros                |
| POST   | `/api/v1/hardware/bin-event`    | —    | Evento de depósito desde basurero |
| POST   | `/api/v1/client/reclaim`        | JWT  | Reclamar puntos (escaneando QR)   |
| POST   | `/api/v1/client/redeem`         | JWT  | Canjear cupón                     |
| GET    | `/api/v1/client/wallet`         | JWT  | Wallet del cliente                |
| GET    | `/api/v1/client/history`        | JWT  | Historial de transacciones        |
| POST   | `/api/v1/staff/validate-coupon` | JWT  | Validar cupón en local            |
| GET    | `/api/v1/staff/reports`         | JWT  | Reportes diarios                  |
| GET    | `/api/v1/admin/bins`            | JWT  | CRUD de basureros                 |
| GET    | `/health`                       | —    | Health check                      |

## Flujo principal

1. **Depósito**: El basurero envía un evento `POST /api/v1/hardware/bin-event` con el peso reciclado
2. **Worker**: BullMQ procesa el evento, calcula puntos (`peso * factor`), registra el depósito y genera un token QR único (válido 3 min)
3. **QR**: El basurero muestra el QR dinámico en pantalla
4. **Escaneo**: El cliente escanea el QR desde la app (`/scan`) y reclama los puntos
5. **Recompensa**: El cliente canjea puntos por cupones desde `/wallet`
6. **Validación**: Staff valida el cupón en el local desde `/staff/validate`

## Arquitectura

```
Basurero (HW) ──POST──▶ Express API ──BullMQ──▶ Worker ──▶ SQLite
                           │                        │
                           ▼                        ▼
                        SSE Events              Sesiones QR
                           │                        │
                           ▼                        ▼
                      Pantalla QR              Cliente app
```
