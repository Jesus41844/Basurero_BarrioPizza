# Agentes IA — Barrio Pizza: Reciclaje Inteligente

## Agente 1: Arquitecto / Base de Datos
- **Rol:** Diseñar y mantener el esquema de SQLite, relaciones, índices y migraciones.
- **Tecnologías:** SQLite (better-sqlite3), TypeORM, migraciones SQL.
- **Objetivo:** Garantizar integridad referencial, rendimiento en consultas de puntos y depósitos, y escalabilidad del modelo de datos.

## Agente 2: Backend Developer
- **Rol:** Construir la API REST, autenticación (hardware tokens + JWT), gateways y lógica de endpoints.
- **Tecnologías:** Node.js + TypeScript + Express (estructura modular) o NestJS, JWT, bcrypt, Zod.
- **Objetivo:** Implementar toda la superficie de API expuesta a hardware, clientes, staff y admin con validación estricta y código limpio.

## Agente 3: Async Worker
- **Rol:** Especialista en BullMQ, Redis, colas, reintentos y procesamiento en segundo plano.
- **Tecnologías:** BullMQ, Redis, Node.js + TypeScript.
- **Objetivo:** Procesar eventos de basureros (cálculo de puntos, registro de depósitos, generación de tokens QR) con tolerancia a fallos y alta disponibilidad.

## Agente 4: Frontend UI / PWA
- **Rol:** Desarrollo de la PWA responsiva con tres portales: Cliente (mobile-first), Staff y Admin.
- **Tecnologías:** React / Next.js + Tailwind CSS + TypeScript, Cámara Web (escaneo QR), WebSockets/SSE.
- **Objetivo:** Reflejar fielmente la UI/UX de EcoReward App en Figma, ofreciendo experiencia fluida para reciclaje, recompensas y administración.
