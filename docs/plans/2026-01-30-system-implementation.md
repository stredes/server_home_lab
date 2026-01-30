# Sistema de descargas con admin y portal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Construir backend NestJS + Prisma con auth, RBAC, archivos y auditoría, más admin React y portal Next.js en directorios separados.

**Architecture:** Monorepo simple con tres carpetas `server/` (API + DB), `back/` (admin React + MUI), `front/` (portal Next.js). La API protege recursos con JWT + RBAC, registra auditoría y almacena archivos local o Vercel Blob.

**Tech Stack:** NestJS, Prisma, PostgreSQL, Redis opcional, React + MUI, Next.js App Router, Docker Compose.

---

### Task 1: Crear estructura de carpetas base

**Files:**
- Create: `server/`, `back/`, `front/`

**Step 1: Write the failing test**
- N/A (estructura)

**Step 2: Run test to verify it fails**
- N/A

**Step 3: Write minimal implementation**
- Crear carpetas base y un README raíz con descripción breve del repo.

**Step 4: Run test to verify it passes**
- N/A

**Step 5: Commit**
```bash
git add README.md server back front
git commit -m "chore: add base directories"
```

### Task 2: Inicializar backend NestJS

**Files:**
- Create: `server/package.json`, `server/src/main.ts`

**Step 1: Write the failing test**
- N/A (scaffold)

**Step 2: Run test to verify it fails**
- N/A

**Step 3: Write minimal implementation**
- Generar proyecto NestJS con estructura estándar.

**Step 4: Run test to verify it passes**
- N/A

**Step 5: Commit**
```bash
git add server
git commit -m "chore: scaffold nestjs backend"
```

### Task 3: Configurar Prisma y PostgreSQL

**Files:**
- Create: `server/prisma/schema.prisma`
- Create: `server/prisma/migrations/...`
- Modify: `server/src/app.module.ts`

**Step 1: Write the failing test**
```ts
// server/test/db/prisma.schema.test.ts
it('defines required models', () => {
  expect(prismaSchema).toContain('model User');
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- prisma.schema.test.ts`
Expected: FAIL missing models

**Step 3: Write minimal implementation**
- Definir modelos y relaciones en Prisma.

**Step 4: Run test to verify it passes**
Run: `npm test -- prisma.schema.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/prisma server/src/app.module.ts
git commit -m "feat: add prisma schema and db setup"
```

### Task 4: Configurar Docker Compose

**Files:**
- Create: `server/docker-compose.yml`
- Create: `server/.env.example`
- Modify: `server/README.md`

**Step 1: Write the failing test**
```ts
// server/test/config/env.example.test.ts
it('contains required env vars', () => {
  expect(env).toContain('DATABASE_URL');
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- env.example.test.ts`
Expected: FAIL missing env vars

**Step 3: Write minimal implementation**
- Definir servicios postgres + backend + redis opcional y .env.example.

**Step 4: Run test to verify it passes**
Run: `npm test -- env.example.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/docker-compose.yml server/.env.example server/README.md
git commit -m "chore: add docker compose and env example"
```

### Task 5: Módulo Auth (login, refresh, logout)

**Files:**
- Create: `server/src/modules/auth/*`
- Modify: `server/src/app.module.ts`
- Test: `server/test/auth/*.test.ts`

**Step 1: Write the failing test**
```ts
it('rejects login with invalid password', async () => {
  const res = await request(app).post('/auth/login').send({ email, password: 'bad' });
  expect(res.status).toBe(401);
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- auth.login.test.ts`
Expected: FAIL (route missing)

**Step 3: Write minimal implementation**
- Crear AuthModule con JWT, refresh token y rotación.

**Step 4: Run test to verify it passes**
Run: `npm test -- auth.login.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/modules/auth server/test/auth
git commit -m "feat: add auth module with jwt and refresh"
```

### Task 6: RBAC Guards y Roles

**Files:**
- Create: `server/src/common/guards/*`
- Modify: `server/src/modules/users/*`
- Test: `server/test/rbac/*.test.ts`

**Step 1: Write the failing test**
```ts
it('blocks access for role without permission', async () => {
  const res = await request(app).get('/users').set('Authorization', `Bearer ${tokenForRole('lector')}`);
  expect(res.status).toBe(403);
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- rbac.users.test.ts`
Expected: FAIL (guard missing)

**Step 3: Write minimal implementation**
- Guard RBAC con decorator de roles.

**Step 4: Run test to verify it passes**
Run: `npm test -- rbac.users.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/common/guards server/src/modules/users server/test/rbac
git commit -m "feat: add rbac guards"
```

### Task 7: Módulo Users (CRUD + roles)

**Files:**
- Create: `server/src/modules/users/*`
- Test: `server/test/users/*.test.ts`

**Step 1: Write the failing test**
```ts
it('creates a user and assigns roles', async () => {
  const res = await request(app).post('/users').send({ email, password, roles: ['admin'] });
  expect(res.status).toBe(201);
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- users.create.test.ts`
Expected: FAIL (route missing)

**Step 3: Write minimal implementation**
- CRUD con validaciones y hash argon2.

**Step 4: Run test to verify it passes**
Run: `npm test -- users.create.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/modules/users server/test/users
git commit -m "feat: add users module"
```

### Task 8: Módulo Files (upload, version, list)

**Files:**
- Create: `server/src/modules/files/*`
- Test: `server/test/files/*.test.ts`

**Step 1: Write the failing test**
```ts
it('uploads a file with metadata', async () => {
  const res = await request(app).post('/files').attach('file', 'test/fixtures/a.txt');
  expect(res.status).toBe(201);
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- files.upload.test.ts`
Expected: FAIL (route missing)

**Step 3: Write minimal implementation**
- Upload multipart, validación mime/tamaño, storage local.

**Step 4: Run test to verify it passes**
Run: `npm test -- files.upload.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/modules/files server/test/files
git commit -m "feat: add files module"
```

### Task 9: Descargas con token temporal

**Files:**
- Modify: `server/src/modules/files/*`
- Test: `server/test/files/*.test.ts`

**Step 1: Write the failing test**
```ts
it('generates a temporary token and downloads', async () => {
  const token = await request(app).post('/files/1/token');
  const res = await request(app).get(`/files/download/${token.body.token}`);
  expect(res.status).toBe(200);
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- files.download.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
- Token firmado con expiración y registro en downloads.

**Step 4: Run test to verify it passes**
Run: `npm test -- files.download.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/modules/files server/test/files
git commit -m "feat: add download tokens"
```

### Task 10: Auditoría automática

**Files:**
- Create: `server/src/modules/audit/*`
- Modify: `server/src/common/interceptors/*`
- Test: `server/test/audit/*.test.ts`

**Step 1: Write the failing test**
```ts
it('writes audit log on critical action', async () => {
  await request(app).post('/files').attach('file', 'test/fixtures/a.txt');
  const logs = await prisma.auditLog.findMany();
  expect(logs.length).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- audit.log.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
- Interceptor con meta_json, ip, user-agent.

**Step 4: Run test to verify it passes**
Run: `npm test -- audit.log.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/modules/audit server/src/common/interceptors server/test/audit
git commit -m "feat: add audit logging"
```

### Task 11: Seguridad (helmet, cors, rate limit)

**Files:**
- Modify: `server/src/main.ts`
- Create: `server/src/config/*`
- Test: `server/test/security/*.test.ts`

**Step 1: Write the failing test**
```ts
it('sets security headers', async () => {
  const res = await request(app).get('/health');
  expect(res.headers['x-content-type-options']).toBe('nosniff');
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- security.headers.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
- Configurar helmet, CORS allowlist y rate limit.

**Step 4: Run test to verify it passes**
Run: `npm test -- security.headers.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/main.ts server/src/config server/test/security
git commit -m "feat: add security middleware"
```

### Task 12: Adaptador Vercel Blob

**Files:**
- Create: `server/src/modules/files/storage/*`
- Test: `server/test/files/*.test.ts`

**Step 1: Write the failing test**
```ts
it('switches storage adapter by env', async () => {
  process.env.STORAGE_DRIVER = 'vercel';
  expect(storage.driverName()).toBe('vercel');
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- files.storage.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
- Interfaz de storage con implementación local y Vercel.

**Step 4: Run test to verify it passes**
Run: `npm test -- files.storage.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/src/modules/files/storage server/test/files
git commit -m "feat: add vercel blob storage adapter"
```

### Task 13: Admin React + MUI (scaffold y layout)

**Files:**
- Create: `back/package.json`
- Create: `back/src/layouts/*`

**Step 1: Write the failing test**
```ts
// back/src/layouts/Layout.test.tsx
it('renders sidebar and topbar', () => {
  render(<Layout />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- Layout.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**
- Scaffold React + MUI, layout base.

**Step 4: Run test to verify it passes**
Run: `npm test -- Layout.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add back
git commit -m "feat: scaffold admin app"
```

### Task 14: Admin Auth + rutas privadas

**Files:**
- Create: `back/src/auth/*`
- Modify: `back/src/router/*`

**Step 1: Write the failing test**
```ts
it('redirects to login when not authenticated', () => {
  render(<ProtectedRoute><Dashboard /></ProtectedRoute>);
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- ProtectedRoute.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**
- Guard de rutas y refresh token.

**Step 4: Run test to verify it passes**
Run: `npm test -- ProtectedRoute.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add back/src/auth back/src/router
git commit -m "feat: add admin auth and route guards"
```

### Task 15: Admin Users CRUD

**Files:**
- Create: `back/src/pages/users/*`
- Test: `back/src/pages/users/*.test.tsx`

**Step 1: Write the failing test**
```ts
it('lists users from API', async () => {
  render(<UsersPage />);
  expect(await screen.findByText('user@example.com')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- UsersPage.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**
- Tabla con paginación y modales CRUD.

**Step 4: Run test to verify it passes**
Run: `npm test -- UsersPage.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add back/src/pages/users
git commit -m "feat: add users admin screen"
```

### Task 16: Admin Files + Audit

**Files:**
- Create: `back/src/pages/files/*`
- Create: `back/src/pages/audit/*`

**Step 1: Write the failing test**
```ts
it('shows audit log rows', async () => {
  render(<AuditPage />);
  expect(await screen.findByText('LOGIN')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- AuditPage.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**
- Tabla de archivos con filtros y audit con filtros.

**Step 4: Run test to verify it passes**
Run: `npm test -- AuditPage.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add back/src/pages/files back/src/pages/audit
git commit -m "feat: add files and audit screens"
```

### Task 17: Portal Next.js (scaffold + auth)

**Files:**
- Create: `front/package.json`
- Create: `front/app/*`

**Step 1: Write the failing test**
```ts
it('requires login before list', () => {
  render(<HomePage />);
  expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- HomePage.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**
- Scaffold Next.js App Router con login.

**Step 4: Run test to verify it passes**
Run: `npm test -- HomePage.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add front
git commit -m "feat: scaffold portal"
```

### Task 18: Portal catálogo y detalle de archivo

**Files:**
- Create: `front/app/file/[id]/page.tsx`
- Modify: `front/app/page.tsx`

**Step 1: Write the failing test**
```ts
it('shows file detail and download button', () => {
  render(<FileDetail />);
  expect(screen.getByText('Descargar')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- FileDetail.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**
- Listado, búsqueda y detalle con botón de descarga.

**Step 4: Run test to verify it passes**
Run: `npm test -- FileDetail.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add front/app/page.tsx front/app/file

git commit -m "feat: add portal catalog and file detail"
```

### Task 19: Documentación y curl examples

**Files:**
- Modify: `server/README.md`
- Modify: `back/README.md`
- Modify: `front/README.md`

**Step 1: Write the failing test**
```ts
it('documents curl examples', () => {
  expect(readme).toContain('curl');
});
```

**Step 2: Run test to verify it fails**
Run: `npm test -- readme.curl.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
- Agregar instrucciones y 5 ejemplos curl.

**Step 4: Run test to verify it passes**
Run: `npm test -- readme.curl.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add server/README.md back/README.md front/README.md

git commit -m "docs: add run instructions and curl examples"
```
