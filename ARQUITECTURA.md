# ARQUITECTURA — El Extranjero Librería

Documento de referencia para la desarrolladora y el equipo. Explica qué es el proyecto, cómo está construido, y cómo mantenerlo.

---

## ¿Qué es este proyecto?

Web completa para **El Extranjero**, librería independiente en Sevilla. Abre en marzo 2026.

El proyecto tiene dos partes:

| Parte | Para quién | URL |
|-------|-----------|-----|
| Tienda pública | Clientes | `/`, `/catalogo`, `/libro/[slug]`, `/eventos`, `/contacto`, `/suscribirse` |
| Panel de administración | Dueño de la librería | `/admin/*` |

---

## Stack técnico (explicado en lenguaje llano)

| Tecnología | Rol | Por qué |
|-----------|-----|---------|
| **Next.js 16** | Framework principal | Maneja tanto el frontend (lo que ve el usuario) como el backend (lógica de servidor) en un solo proyecto. App Router = estructura moderna con carpetas. |
| **React 19** | Interfaz de usuario | La librería para construir componentes visuales. Next.js lo usa por debajo. |
| **TypeScript** | Lenguaje | JavaScript con tipos. Evita errores tontos y mejora el autocompletado. |
| **Tailwind CSS v4** | Estilos | Clases de utilidad directamente en el HTML. Sin archivos CSS separados por componente. |
| **PostgreSQL** | Base de datos | Base de datos relacional. Guarda libros, clientes, pedidos, suscriptores, etc. |
| **Neon** | Hosting de la BD | PostgreSQL en la nube, gratis para proyectos pequeños. Se conecta con una URL. |
| **Prisma** | ORM (intermediario BD) | Traduce código TypeScript a consultas SQL. Gestiona el schema (estructura) de la BD y las migraciones. |
| **NextAuth v5** | Autenticación | Gestiona el login del panel admin. Email + contraseña con sesión segura. |
| **bcryptjs** | Cifrado de contraseñas | Las contraseñas nunca se guardan en texto plano, siempre como hash. |
| **Resend** | Emails | Servicio para enviar emails transaccionales (formulario de contacto) y newsletters. |
| **Vercel Blob** | Almacenamiento de imágenes | Subida y hosting de las portadas de libros desde el panel admin. |
| **Vercel** | Deploy | Plataforma de hosting conectada a GitHub. Cada push a `main` despliega automáticamente. |

---

## Estructura de carpetas

```
libreria/
├── prisma/
│   ├── schema.prisma          ← Define los modelos de la base de datos
│   ├── migrations/            ← Historial de cambios en la BD (no editar manualmente)
│   └── seed.ts                ← Datos de prueba iniciales (libros, admin)
│
├── public/
│   ├── el-extranjero.png      ← Logo
│   └── fotos/                 ← Imágenes estáticas del slider de inicio
│
├── src/
│   ├── app/                   ← Rutas de la aplicación (App Router de Next.js)
│   │   │
│   │   ├── layout.tsx         ← Layout raíz: header + nav + footer (envuelve TODA la app)
│   │   ├── page.tsx           ← Página de inicio (/)
│   │   ├── globals.css        ← Variables CSS globales + imports de fuentes
│   │   │
│   │   ├── catalogo/
│   │   │   └── page.tsx       ← Grid de todos los libros (/catalogo)
│   │   │
│   │   ├── libro/[slug]/
│   │   │   └── page.tsx       ← Detalle de libro (/libro/la-sombra-del-viento)
│   │   │
│   │   ├── eventos/
│   │   │   └── page.tsx       ← Lista de eventos públicos (/eventos)
│   │   │
│   │   ├── contacto/
│   │   │   └── page.tsx       ← Formulario de contacto (/contacto)
│   │   │
│   │   ├── suscribirse/
│   │   │   └── page.tsx       ← Formulario de suscripción al newsletter
│   │   │
│   │   ├── api/auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts   ← Endpoint de NextAuth (no tocar)
│   │   │
│   │   └── admin/             ← Panel de administración (protegido por login)
│   │       ├── layout.tsx     ← Layout del admin: sidebar + navegación
│   │       ├── page.tsx       ← Dashboard con estadísticas
│   │       ├── login/
│   │       │   └── page.tsx   ← Formulario de login
│   │       ├── libros/
│   │       │   ├── page.tsx         ← Lista de libros con acciones
│   │       │   ├── nuevo/page.tsx   ← Formulario crear libro + subir portada
│   │       │   ├── [id]/editar/
│   │       │   │   └── page.tsx     ← Formulario editar libro existente
│   │       │   └── actions.ts       ← Server Actions: crear, editar, archivar libro
│   │       ├── clientes/
│   │       │   └── page.tsx         ← Lista de clientes y suscriptores
│   │       ├── newsletter/
│   │       │   ├── page.tsx         ← Redactar y enviar newsletter
│   │       │   └── actions.ts       ← Server Action: enviar newsletter via Resend
│   │       ├── pedidos/
│   │       │   ├── page.tsx         ← Lista de pedidos con filtros
│   │       │   └── actions.ts       ← Server Action: cambiar estado de pedido
│   │       └── eventos/
│   │           ├── page.tsx         ← Lista de eventos
│   │           ├── nuevo/page.tsx   ← Crear evento
│   │           ├── [id]/editar/
│   │           │   └── page.tsx     ← Editar evento
│   │           └── actions.ts       ← Server Actions: crear, editar, archivar evento
│   │
│   ├── components/
│   │   ├── Slider.tsx         ← Carrusel de imágenes (página de inicio)
│   │   └── admin/             ← Componentes reutilizables del admin
│   │
│   └── lib/
│       ├── prisma.ts          ← Cliente Prisma (singleton, un solo instancia)
│       └── auth.ts            ← Configuración NextAuth
│
├── middleware.ts               ← Protege /admin/* (redirige a /admin/login si no autenticado)
├── .env                        ← Variables de entorno (¡nunca subir a git!)
├── .env.example                ← Plantilla de variables de entorno (sí subir a git)
├── package.json                ← Dependencias y scripts del proyecto
└── tsconfig.json               ← Configuración TypeScript
```

---

## Sección pública (clientes)

### `/` — Inicio
- Slider de imágenes (actualmente con fotos estáticas)
- Grid de libros destacados (los marcados como `destacado: true` en la BD)

### `/catalogo` — Catálogo completo
- Todos los libros activos, ordenados por título
- Grid responsive: 2 → 3 → 4 columnas según tamaño de pantalla

### `/libro/[slug]` — Detalle de libro
- URL amigable basada en el slug del libro (ej: `/libro/cien-anos-de-soledad`)
- Muestra: portada, título, autor, editorial, año, precio, géneros, descripción, stock

### `/eventos` — Eventos
- Lista de eventos próximos desde la base de datos
- Creados desde el panel admin

### `/contacto` — Contacto
- Formulario: nombre, email, mensaje
- Al enviar → email a la librería via Resend

### `/suscribirse` — Newsletter
- Formulario: nombre (opcional), email
- Al enviar → crea registro `Suscriptor` en la BD

---

## Panel admin (`/admin/*`)

Acceso solo con email + contraseña. Si no estás autenticado, el middleware te redirige a `/admin/login`.

### `/admin` — Dashboard
Contadores en tiempo real:
- Total de libros activos
- Total de suscriptores al newsletter
- Pedidos pendientes
- Total de clientes

### `/admin/libros` — Catálogo
- Tabla con todos los libros (activos y archivados)
- Acciones: editar, marcar como destacado, archivar
- Botón "Nuevo libro" → `/admin/libros/nuevo`

### `/admin/libros/nuevo` y `/admin/libros/[id]/editar`
Formulario con todos los campos del libro:
- Título, autor, ISBN, editorial, año, precio, stock
- Géneros (etiquetas separadas por comas)
- Descripción
- **Portada**: `input type="file"` → sube a Vercel Blob → guarda URL en BD
- Slug (generado automáticamente del título, editable)
- Destacado (checkbox)

### `/admin/clientes`
- Lista de clientes registrados
- Lista de suscriptores al newsletter (con su estado activo/inactivo)

### `/admin/newsletter`
- Textarea para el asunto y el cuerpo del email
- Botón "Enviar a todos los suscriptores activos"
- Historial de newsletters enviados

### `/admin/pedidos`
- Lista de pedidos con cliente, total, fecha, estado
- Cambiar estado: PENDIENTE → CONFIRMADO → PREPARANDO → LISTO → ENTREGADO

### `/admin/eventos`
- Crear, editar y archivar eventos de la librería
- Campos: título, fecha, descripción, imagen (Vercel Blob), activo

---

## Flujo de imágenes de portadas

```
Panel admin (formulario)
         │
         │  <input type="file" accept="image/*">
         ▼
Server Action (src/app/admin/libros/actions.ts)
         │
         │  import { put } from '@vercel/blob'
         │  const blob = await put(filename, file, { access: 'public' })
         ▼
Vercel Blob CDN
         │
         │  blob.url = "https://xxxx.public.blob.vercel-storage.com/portada.jpg"
         ▼
Base de datos (campo Libro.portada = blob.url)
         │
         ▼
Páginas públicas (<Image src={libro.portada} fill />)
```

**Importante**: Las imágenes del slider de inicio son estáticas (en `/public/fotos/`). Solo las portadas de libros van a Vercel Blob.

---

## Base de datos — Modelos

| Modelo | Para qué |
|--------|---------|
| `Libro` | Catálogo de libros. Campos: título, autor, precio, stock, portada (URL), slug, géneros, activo, destacado |
| `Cliente` | Personas que hacen pedidos. Email único. Pueden estar suscritas al newsletter |
| `Suscriptor` | Solo email para newsletter. Independiente de Cliente |
| `Newsletter` | Historial de emails enviados (asunto + cuerpo) |
| `Pedido` | Pedidos de clientes. Estados: PENDIENTE→CONFIRMADO→PREPARANDO→LISTO→ENTREGADO→CANCELADO |
| `ItemPedido` | Línea de un pedido (qué libro, cantidad, precio en ese momento) |
| `Evento` | Eventos de la librería (presentaciones, talleres) |
| `AdminUser` | Usuarios del panel admin con contraseña hasheada |

---

## Variables de entorno

Archivo `.env` en la raíz. **Nunca subir a git** (está en `.gitignore`).

```bash
# ── Base de datos ──────────────────────────────────────────────
# URL de conexión a Neon PostgreSQL
# Obtener en: neon.tech → tu proyecto → Connection string
DATABASE_URL="postgresql://..."

# ── NextAuth ───────────────────────────────────────────────────
# Secret para firmar las cookies de sesión
# Generar con: openssl rand -base64 32
NEXTAUTH_SECRET="..."

# URL base de la app (en local: http://localhost:3000)
# En producción Vercel lo pone automáticamente en VERCEL_URL
NEXTAUTH_URL="http://localhost:3000"

# ── Resend (emails) ────────────────────────────────────────────
# API key de Resend
# Obtener en: resend.com → API Keys → Create API Key
RESEND_API_KEY="re_..."

# Email desde el que se envían los correos
# En producción debe ser un email de tu dominio verificado en Resend
RESEND_FROM_EMAIL="noticias@elextranjero.es"

# Email donde llegan los mensajes del formulario de contacto
RESEND_TO_EMAIL="hola@elextranjero.es"

# ── Vercel Blob (portadas de libros) ───────────────────────────
# Token de Vercel Blob
# En local: obtener en vercel.com → tu proyecto → Storage → Blob → .env.local
# En Vercel: se añade automáticamente al conectar Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

---

## Cómo hacer deploy en Vercel

### Primera vez

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) → "Add New Project" → importa el repositorio
3. En "Environment Variables", añade todas las variables del `.env`
4. En Vercel Blob: Storage → Create Store → conecta al proyecto (añade `BLOB_READ_WRITE_TOKEN` automáticamente)
5. "Deploy" → Vercel construye y despliega

### Actualizaciones

Simplemente haz `git push origin main`. Vercel detecta el push y despliega automáticamente.

### Variables de entorno en Vercel

- `DATABASE_URL`: la misma de Neon (conexión sin pooling para builds)
- `NEXTAUTH_URL`: la URL de producción de Vercel (ej: `https://el-extranjero.vercel.app`)
- `NEXTAUTH_SECRET`: el mismo secret seguro
- `RESEND_API_KEY` y `RESEND_FROM_EMAIL`: de tu cuenta Resend
- `BLOB_READ_WRITE_TOKEN`: Vercel lo añade automáticamente

### Migraciones en producción

Después de cambiar el schema de Prisma:
```bash
# En local (desarrollo):
npx prisma migrate dev --name nombre-descripcion

# En producción (Vercel lo ejecuta en el build si configuras):
npx prisma migrate deploy
```

Para que Vercel ejecute las migraciones automáticamente, añade en `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma migrate deploy && next build"
}
```

---

## Comandos útiles de desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ver y editar la base de datos visualmente
npx prisma studio

# Generar cliente Prisma (después de cambiar schema.prisma)
npx prisma generate

# Crear migración (después de cambiar schema.prisma)
npx prisma migrate dev --name descripcion-del-cambio

# Rellenar BD con datos de prueba
npx prisma db seed

# Ver el log de SQL de Prisma (debug)
# Cambia log: ['error'] a log: ['query', 'error'] en src/lib/prisma.ts
```

---

## Roadmap de fases

### Fase 1 — Lanzamiento (✅ Completada)
- [x] Web pública: inicio, catálogo, detalle de libro
- [x] Base de datos con Prisma + Neon
- [x] Diseño: tipografía, colores, componentes base

### Fase 2 — Panel admin (en curso)
- [x] Autenticación (NextAuth + bcrypt)
- [x] Dashboard con estadísticas
- [x] Gestión de libros (CRUD + subida de portadas)
- [x] Gestión de clientes y suscriptores
- [x] Envío de newsletter (Resend)
- [x] Gestión de pedidos (cambio de estado)
- [x] Gestión de eventos
- [x] Páginas públicas pendientes: /contacto, /suscribirse, /eventos

### Fase 3 — Pedidos y pagos (futuro)
- [ ] Carrito de compra
- [ ] Checkout con Stripe
- [ ] Gestión de stock automática
- [ ] Emails de confirmación de pedido
- [ ] Sistema de reservas

---

## Decisiones técnicas documentadas

### ¿Por qué App Router y no Pages Router?
App Router es el estándar moderno de Next.js. Permite Server Components (componentes que se renderizan en servidor, sin JS en el cliente), Server Actions (formularios sin API routes), y mejor organización de código.

### ¿Por qué NextAuth v5 (beta)?
Es la versión compatible con Next.js App Router. La v4 tiene problemas de compatibilidad con App Router. La beta es estable para este caso de uso.

### ¿Por qué Neon y no Supabase?
Neon es PostgreSQL puro sin extras. Más simple para empezar. Supabase añade autenticación, storage y realtime que no necesitamos (usamos NextAuth, Vercel Blob, etc.).

### ¿Por qué Vercel Blob y no Cloudinary?
Integración nativa con Vercel. Un token, sin dependencias externas adicionales. Para las necesidades de una librería pequeña es más que suficiente.

### ¿Por qué Resend y no SendGrid/Mailgun?
API más simple, excelente developer experience, generoso plan gratuito (3.000 emails/mes). Perfecto para newsletter de librería independiente.
