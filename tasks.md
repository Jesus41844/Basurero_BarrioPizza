# Backlog de Tareas — Barrio Pizza: Reciclaje Inteligente

---

## Fase 1: Modelado de Base de Datos y Configuración Base

| ID | Descripción | Agente | Dependencias | Estado |
|----|------------|--------|--------------|--------|
| T01 | Configurar proyecto: inicializar `package.json`, `tsconfig.json` y estructura de carpetas | Backend-Dev | — | Completado |
| T02 | Diseñar esquema de BD: tablas `Usuarios`, `Basureros`, `Depositos`, `SesionesQR`, `Cupones`, `Canjes` | Arquitecto/BD | T01 | Completado |
| T03 | Implementar migraciones iniciales con TypeORM + SQLite | Arquitecto/BD | T02 | Completado |
| T04 | Configurar conexión a SQLite y Redis desde la app | Backend-Dev | T01, T03 | Completado |

## Fase 2: API Endpoint Ingestion

| ID | Descripción | Agente | Dependencias | Estado |
|----|------------|--------|--------------|--------|
| T05 | Implementar middleware de autenticación para hardware (`X-Bin-Token`) | Backend-Dev | T01 | Completado |
| T06 | Crear endpoint `POST /api/v1/hardware/bin-event` con validación de payload (Zod) | Backend-Dev | T04, T05 | Completado |
| T07 | Configurar BullMQ: crear `reciclaje-queue` y conectar con Redis | Async-Worker | T04 | Completado |
| T08 | Integrar endpoint para inyectar trabajo en la cola y responder `202 Accepted` | Backend-Dev | T06, T07 | Completado |

## Fase 3: Worker Processing

| ID | Descripción | Agente | Dependencias | Estado |
|----|------------|--------|--------------|--------|
| T09 | Implementar Worker de BullMQ que consume `reciclaje-queue` | Async-Worker | T07 | Completado |
| T10 | Lógica de cálculo de puntos: `pesoGramos * factorMultiplicador` del basurero | Async-Worker | T09 | Completado |
| T11 | Registrar depósito en tabla `Depositos` (estado: no reclamado) | Async-Worker | T09, T02 | Completado |
| T12 | Generar `tokenUnico` en `SesionesQR` con expiración de 3 minutos | Async-Worker | T11 | Completado |
| T13 | Emitir evento SSE/WebSocket para que el basurero muestre el QR | Async-Worker | T12 | Completado |

## Fase 4: Portal Cliente & Flujo de Reclamación

| ID | Descripción | Agente | Dependencias | Estado |
|----|------------|--------|--------------|--------|
| T14 | Inicializar proyecto Next.js + Tailwind CSS con estructura de tres portales | Frontend-UI | T01 | Completado |
| T15 | Crear vista `/home` — Dashboard con EcoRewards, historial y acceso al escáner | Frontend-UI | T14 | Completado |
| T16 | Crear vista `/scan` — Escaneo de QR dinámico con cámara web | Frontend-UI | T14 | Completado |
| T17 | Implementar endpoint `POST /api/v1/client/reclaim` que valida token QR y acredita puntos | Backend-Dev | T04, T12 | Completado |
| T18 | Conectar `/scan` con backend para reclamar puntos (loading animado) | Frontend-UI | T16, T17 | Completado |
| T19 | Crear vista `/rewards` — Catálogo de cupones con costo en puntos y botón "Canjear" | Frontend-UI | T14 | Completado |
| T20 | Implementar endpoint `POST /api/v1/client/redeem` que genera cupón único | Backend-Dev | T04 | Completado |

## Fase 5: Interfaces de Staff y Administrador

| ID | Descripción | Agente | Dependencias | Estado |
|----|------------|--------|--------------|--------|
| T21 | Crear vista `/staff/validate` — Panel de validación de cupones (input manual + escáner) | Frontend-UI | T14 | Completado |
| T22 | Implementar endpoint `POST /api/v1/staff/validate-coupon` que valida y marca cupón como consumido | Backend-Dev | T04, T20 | Completado |
| T23 | Crear vista `/admin` — Dashboard de configuración de basureros | Frontend-UI | T14 | Completado |
| T24 | Implementar CRUD `/api/v1/admin/bins` para gestión de basureros | Backend-Dev | T04 | Completado |
| T25 | Crear vista `/admin/reports` — Reportes diarios de depósitos, puntos y canjes | Frontend-UI | T14 | Completado |
| T26 | Implementar endpoint `GET /api/v1/admin/reports` con agregaciones diarias | Backend-Dev | T04 | Completado |
