# Suitoholic — Bespoke Tailoring Store

A Next.js storefront, an Express.js API backed by PostgreSQL (Neon), and an admin dashboard. The admin dashboard edits the catalog, the page content, the bespoke "Add to Bag" customizer, bags, orders and store settings.

```
suitoholic-app/
├── src/                     Next.js 16 storefront + /admin dashboard
│   ├── app/                 routes (shop, product, cart, checkout, order, track-order, [slug] info pages, admin/…)
│   ├── components/          storefront UI (bag/ = cart & order components, admin/ = dashboard UI)
│   ├── content/             CMS: section defaults (sections/*.ts) + registry.ts + merge.ts
│   ├── context/             SiteDataProvider (content/catalog/settings), CartProvider (bag)
│   ├── data/                built-in catalog (fallback when the API is down; seed source)
│   └── lib/                 API client, shared types, server-side site loader
└── server/                  Express.js API
    └── src/
        ├── config/          env parsing
        ├── db/              pg pool, migration runner, migrations/*.sql
        ├── routes/          public.routes.js (/api/*), admin.routes.js (/api/admin/*)
        ├── controllers/     HTTP layer
        ├── services/        business logic (catalog, cart, orders, content, media, users, dashboard)
        ├── middleware/      auth (JWT), validation (zod), uploads, error handling
        ├── validators/      zod request schemas
        └── seed/            first admin + original catalog
```

## How it fits together

- **Catalog, content and settings**: the root layout calls `GET /api/site` on every request and provides the result through `SiteDataProvider`. Components read page copy with `useContent("<section>")`. That hook merges the admin's saved edits over the built-in defaults in `src/content/sections/*.ts`. Edits made in the admin show up on the next page load.
- **Speed**: the API keeps that storefront bundle in memory and clears it whenever an admin saves something or an order changes stock, so pages stay fast even when the database is far away.
- **Fallback**: if the API is unreachable, the site still renders with the built-in catalog and copy. Adding to the bag and checkout need the API.
- **Bag (Add to Bag)**: the bag lives in Postgres (`carts` and `cart_items`). The browser only keeps the bag id. The server recomputes all prices, the bespoke tailoring fee and shipping. Checkout runs in one transaction that locks rows, checks and decrements stock, creates the order and closes the bag.
- **Media**: uploaded images and videos are stored in Postgres (`media` table) and served from `/api/media/:id/:filename`. No separate file storage is needed.

## Local development

Requirements: Node.js 20+ (22 recommended).

```bash
npm install                 # storefront
npm run setup:api           # API dependencies (server/)
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:4000
cp server/.env.example server/.env
```

Edit `server/.env`:

- `DATABASE_URL` — your Neon connection string (Neon dashboard → Connect). Use the **pooled** string, i.e. the host contains `-pooler`. End it with `?sslmode=verify-full&channel_binding=require` (encrypted, certificate verified).
- `JWT_SECRET` — a long random string: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the first admin account. It is created on first start, only if no admin exists yet.

Run both apps, each in its own terminal:

```bash
npm run dev:api   # API on http://localhost:4000 — applies migrations and seeds the catalog on first start
npm run dev       # storefront on http://localhost:3000, admin on http://localhost:3000/admin
```

**No database at hand?** `npm run db:local` starts a local Postgres-compatible database (PGlite) on port 54329. Point `server/.env` at it as follows:

```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54329/postgres
DB_POOL_MAX=1
DB_SSL=false
```

### Database commands (run inside `server/`)

| Command | What it does |
| --- | --- |
| `npm run migrate` | Apply pending SQL migrations in `src/db/migrations/` |
| `npm run seed` | Migrate, create the first admin, load the catalog if the database is empty |
| `npm run seed:reset` | Wipe products, categories, bags and orders, then reload the original catalog |
| `npm run test:api` | End-to-end API test (46 checks). Creates temporary data and leaves cancelled test orders, so run it on a dev database or Neon branch |

To change the schema, add a new numbered file such as `003_add_coupons.sql`. Never edit a migration that has already run.

## Admin dashboard (`/admin`)

| Area | What you can do |
| --- | --- |
| Dashboard | Revenue, orders, bags (active and abandoned), low stock, subscribers, new inquiries, 30-day chart |
| Orders | Filter and search; view bespoke measurements per item; update status and payment; status history; notes; print a job sheet |
| Bags | Live, abandoned and converted bags with every bespoke selection |
| Products / Categories | Full CRUD: images, gallery, colourways, stock (or made to order), pricing, featured/active flags, homepage collections |
| Page Content | Edit every section of every page: header, footer, home, shop, product, About, Fabrics, Custom Fit, bag/checkout, info pages, SEO. "Reset to default" restores the original copy |
| Bespoke Customizer | Page Content → Bespoke Customizer: chest sizes with collar/shoulder, body fits, heights, collar and cuff styles, thread colours, step texts |
| Media | Upload and manage images and videos used anywhere on the site |
| Inquiries | Fabric swatch requests and contact-form messages |
| Subscribers | Newsletter list with CSV export |
| Settings | Currency, shipping fee and free-shipping threshold, bespoke tailoring fee, payment methods (COD/UPI), abandoned-bag window |
| Users | Admin and editor accounts. Editors cannot change settings or users |

## API overview

Public (`/api`): `GET /site`, `/catalog`, `/products`, `/products/:idOrSlug`, `/categories`, `/content`, `/settings` · bag: `POST /cart`, `GET /cart/:id`, `POST /cart/:id/items`, `PATCH|DELETE /cart/:id/items/:itemId` · `POST /orders`, `GET /orders/:orderNumber?email=` · `POST /newsletter`, `POST /inquiries` · `GET /media/:id/:filename` · `GET /health`.

Admin (`/api/admin`, `Authorization: Bearer <jwt>` from `POST /auth/login`): `dashboard`, `products`, `categories`, `orders`, `carts`, `content/:key`, `media`, `inquiries`, `subscribers`, `settings`, `users`, `auth/me`, `auth/password`.

## Deployment

- **Database**: Neon. Migrations run automatically when the API starts (`AUTO_MIGRATE=true`).
- **API**: any Node host with a long-running process, e.g. Render, Railway or Fly.io. Root directory `server`, start command `npm start`. Set `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `PUBLIC_URL` (the API's public URL), `CORS_ORIGINS` (the storefront URL) and `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- **Storefront**: Vercel. Set `NEXT_PUBLIC_API_URL` to the API's public URL.
