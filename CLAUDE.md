# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**El Extranjero** — full-stack web for an independent bookstore in Sevilla (opening March 2026). Built with Next.js App Router + Server Actions, PostgreSQL via Prisma, NextAuth v5, Resend, and Vercel Blob.

## Commands

```bash
# Development
npm run dev                                          # Start dev server (webpack, not Turbopack)
npx prisma studio                                    # Visual DB editor

# Build
NEXT_TURBOPACK=false npx next build                 # Build with webpack (Turbopack has prerender glitch on /catalogo)
npm run build                                        # Runs: prisma generate && next build

# Database
npx prisma migrate dev --name <description>          # Create migration after schema changes
npx prisma generate                                  # Regenerate Prisma client after schema changes
npx prisma migrate deploy                            # Apply migrations in production
npx prisma db seed                                   # Seed with test data (books + admin user)

# Seed script (requires ts-node)
npm run seed
```

> **Turbopack warning**: Use `NEXT_TURBOPACK=false npx next build` for builds — Turbopack has a prerender glitch on `/catalogo`.

## Architecture

### Routing and data flow

All pages are **React Server Components** that query the database directly via Prisma. There are no API routes except `/api/auth/[...nextauth]`. Forms use **Server Actions** (files named `actions.ts` colocated with routes).

```
src/
├── app/
│   ├── layout.tsx              ← Root layout: header + nav + footer
│   ├── page.tsx                ← Home: slider + featured books
│   ├── catalogo/               ← Public book grid
│   ├── libro/[slug]/           ← Book detail page
│   ├── eventos/                ← Public events list
│   ├── contacto/               ← Contact form → email via Resend
│   ├── suscribirse/            ← Newsletter signup → Suscriptor in DB
│   ├── api/auth/[...nextauth]/ ← NextAuth handler (do not touch)
│   └── admin/                  ← Protected panel (all routes behind auth)
│       ├── layout.tsx          ← Admin sidebar layout
│       ├── libros/actions.ts   ← CRUD + Vercel Blob upload
│       ├── newsletter/actions.ts ← Resend bulk send
│       ├── pedidos/actions.ts  ← Order status transitions
│       ├── eventos/actions.ts
│       └── slider/actions.ts
├── components/
│   ├── Slider.tsx              ← Homepage carousel (accepts slides prop from server)
│   └── admin/LibroForm.tsx     ← Reusable book form
└── lib/
    ├── prisma.ts               ← Prisma singleton (global to avoid leaks in dev)
    └── auth.ts                 ← NextAuth config (CredentialsProvider + bcryptjs)
```

### Auth and middleware

- **Middleware** lives in `src/proxy.ts` (Next.js 16 convention, not `middleware.ts`)
- Protects all `/admin/*` routes except `/admin/login`
- Uses NextAuth v5 beta — compatible with App Router

### Image upload flow

Book covers and event images are uploaded to **Vercel Blob** in Server Actions using `@vercel/blob`'s `put()`. The returned URL is stored in the DB. Next.js `<Image>` renders them via the allowed remote pattern `*.public.blob.vercel-storage.com`.

Slider images are also uploaded via admin to Vercel Blob (managed in `/admin/slider`).

### Database models

Key relationships: `Pedido → Cliente`, `Pedido → ItemPedido → Libro`. Newsletter (`Suscriptor`) is independent of `Cliente`. Admin login uses a separate `AdminUser` model.

Order states: `PENDIENTE → CONFIRMADO → PREPARANDO → LISTO → ENTREGADO → CANCELADO`

## Environment variables

```bash
DATABASE_URL=            # Neon PostgreSQL connection string
NEXTAUTH_SECRET=         # openssl rand -base64 32
NEXTAUTH_URL=            # http://localhost:3000 (Vercel sets automatically in prod)
RESEND_API_KEY=          # re_...
RESEND_FROM_EMAIL=       # noticias@elextranjero.es
RESEND_TO_EMAIL=         # hola@elextranjero.es
BLOB_READ_WRITE_TOKEN=   # vercel_blob_rw_... (auto-set when Blob Storage connected)
```

## Current phase

**Phase 2 complete.** Phase 3 (Stripe payments, shopping cart, stock management) is next.


## Instructions
When commiting, don't add claude as a colaborator