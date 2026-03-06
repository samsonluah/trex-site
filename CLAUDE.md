# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000) — uses Webpack explicitly
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
```

No test suite is configured. The app root is `trex-site-v2/` — all commands run from there.

## Architecture

**TREX Athletics Club** — Next.js 16 App Router e-commerce site with admin dashboard.

### Stack
- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style)
- **Animation**: Framer Motion 12
- **State**: Zustand 5 (cart, persisted to localStorage as `"trex-cart"`)
- **Database**: Supabase (PostgreSQL) via `@supabase/ssr`
- **Payments**: Stripe (live keys) with webhook handling
- **Email**: Resend
- **Path alias**: `@/*` → `src/*`

### App Router Layout Groups
```
src/app/
  (shop)/          # Public storefront (homepage, products, cart, checkout, orders)
  admin/           # Protected dashboard — guarded by middleware.ts
    (dashboard)/   # Products, gallery, orders management
    login/         # Public admin login
  gallery/         # Public gallery
  coaching/        # Coaching/about page
  api/
    admin/         # Protected CRUD endpoints (products, gallery, orders)
    stripe/        # checkout session + webhook
```

### Auth & Middleware
`src/middleware.ts` protects all `/admin/*` routes except `/admin/login` using Supabase SSR session validation. Unauthorized users are redirected to `/admin/login?redirectTo=<path>`.

Three Supabase clients:
- `lib/supabase/server.ts` — server components (cookie-based session)
- `lib/supabase/client.ts` — browser components (anon key)
- `lib/supabase/admin.ts` — API routes requiring service role (bypasses RLS)

### E-commerce Flow
1. Cart managed in Zustand store (`src/stores/cart.ts`)
2. Checkout → `POST /api/stripe/checkout` creates Supabase order (status: `"pending"`) + Stripe session
3. Stripe webhook (`POST /api/stripe/webhook`) updates order to `"paid"`
4. Admin fulfills orders via dashboard

### Key Types (`src/types/index.ts`)
- `Product` — includes `stripe_price_id`, `sizes[]`, `in_stock`, `pre_order`, `sort_order`
- `Order` — status: `"pending" | "paid" | "fulfilled" | "cancelled"`
- `CartItem` — keyed by `productId + size`
- `GalleryImage` — stored in Supabase storage bucket `"gallery"`

### Brand / Styling
Custom CSS variables in `globals.css`:
- Background: `#F5F5F0` (cream), Foreground: `#1A1A1A`, Accent: `#F2C94C` (gold)
- Custom classes: `.site-button`, `.site-card`, grain texture effect on hero
- Animations: `fade-up`, `marquee`, `scroll-line`, `slide-up-fade`

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
```

### Image Hosting
`next.config.ts` allows remote images from `*.supabase.co`. Gallery images are stored in Supabase storage.

### Supabase Tables
`products`, `gallery_images`, `orders` — schema must exist in the connected Supabase project.
