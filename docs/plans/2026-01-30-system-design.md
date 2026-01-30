# Diseño del sistema de descargas con admin y portal

**Fecha:** 2026-01-30

## Objetivo
Diseñar un sistema web completo con backend API, panel de administración y portal de descargas con login obligatorio, soportando control de acceso por roles, auditoría y almacenamiento local con opción Vercel Blob.

## Arquitectura
El sistema tiene tres capas. El frontend de administración (React + MUI) y el portal (Next.js App Router) consumen un backend NestJS. El backend expone API REST, aplica autenticación con JWT access + refresh y controla permisos con RBAC. La base de datos PostgreSQL guarda usuarios, roles, archivos, auditoría y descargas. El almacenamiento de archivos usa disco local por defecto y un adaptador opcional para Vercel Blob. Redis es opcional para rate limiting y revocación de refresh tokens.

**Diagrama textual:**

Admin (React+MUI) ─┐
                  ├──> API (NestJS) ──> PostgreSQL
Portal (Next.js) ─┘             ├──> Storage local
                               └──> Vercel Blob (opcional)

## Stack
- Backend: NestJS + TypeScript
- DB: PostgreSQL + Prisma (migraciones)
- Auth: JWT access + refresh, rotación, RBAC
- Storage: local + adaptador Vercel Blob
- Opcional: Redis (rate limit y revocación)
- Admin: React + MUI
- Portal: Next.js (App Router)
- Deploy: Docker Compose (backend + db + redis)

## Modelo de datos (tablas principales)
**users**: id, email, password_hash, nombre, estado, created_at
**roles**: id, name
**user_roles**: user_id, role_id
**files**: id, filename, original_name, mime_type, size, checksum, storage_path, version, tags, is_active, expires_at, created_by, created_at
**file_permissions**: file_id, role_id
**downloads**: id, file_id, user_id, downloaded_at, ip, user_agent
**audit_logs**: id, actor_user_id, action, entity, entity_id, meta_json, ip, created_at

## Endpoints (lista)
**Auth**
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

**Users / Roles**
- GET /users
- POST /users
- GET /users/:id
- PATCH /users/:id
- DELETE /users/:id
- GET /roles
- POST /users/:id/roles

**Files**
- POST /files
- GET /files
- GET /files/:id
- PATCH /files/:id
- POST /files/:id/version
- POST /files/:id/token
- GET /files/download/:token

**Audit / Downloads**
- GET /audit
- GET /downloads

**Stats (opcional)**
- GET /files/stats/latest
- GET /files/stats/top

## Pantallas principales
**Admin**
- /login
- /dashboard
- /users
- /files
- /audit

**Portal**
- /login
- /
- /file/[id]

## Seguridad y buenas prácticas
- JWT access corto y refresh con rotación y revocación.
- Hash de password con argon2.
- Guards RBAC por rol en NestJS.
- Validación de input con DTOs y class-validator.
- Rate limit en login y descarga; Redis recomendado.
- CORS con allowlist estricto.
- Helmet y cabeceras seguras.
- Nombres de archivo sanitizados y sin path traversal.
- Tokens de descarga firmados y de corta vida.
- Auditoría automática vía interceptor.
- Escaneo AV opcional con ClamAV antes de activar archivos.

## Justificación de decisiones
- NestJS facilita módulos, guards, pipes e interceptores para seguridad y auditoría.
- Prisma ofrece migraciones y tipado fuerte.
- RBAC con roles simplifica permisos y catálogo.
- Next.js para el portal por rutas dinámicas y despliegue sencillo.
- React + MUI para admin por rapidez y consistencia visual.
- Vercel Blob integra rápido con entornos Vercel.
