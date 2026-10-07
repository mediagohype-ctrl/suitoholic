-- Suitoholic core schema (PostgreSQL / Neon)

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------- admin users
CREATE TABLE admin_users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  active        BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER admin_users_updated BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------- categories
CREATE TABLE categories (
  id           SERIAL PRIMARY KEY,
  key          TEXT NOT NULL UNIQUE,              -- e.g. "formal_shirts" (used in shop URLs)
  title        TEXT NOT NULL,                     -- shop sidebar title
  short_title  TEXT NOT NULL DEFAULT '',          -- filter pill label
  mobile_title JSONB NOT NULL DEFAULT '[]',       -- two-line mobile title
  subtitle     TEXT NOT NULL DEFAULT '',          -- short shop subtitle
  home_title   TEXT NOT NULL DEFAULT '',          -- homepage collection heading
  description  TEXT NOT NULL DEFAULT '',          -- homepage collection description
  tag          TEXT NOT NULL DEFAULT '',
  image        TEXT NOT NULL DEFAULT '',
  bg_image     TEXT NOT NULL DEFAULT '',
  show_on_home BOOLEAN NOT NULL DEFAULT false,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------------- products
CREATE TABLE products (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  category_key     TEXT NOT NULL REFERENCES categories(key) ON UPDATE CASCADE ON DELETE RESTRICT,
  price            NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(12, 2) CHECK (compare_at_price >= 0),
  subtitle         TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  fabric           TEXT NOT NULL DEFAULT '',
  thread_count     TEXT NOT NULL DEFAULT '',
  collar           TEXT NOT NULL DEFAULT '',
  cuff             TEXT NOT NULL DEFAULT '',
  fit              TEXT NOT NULL DEFAULT '',
  image            TEXT NOT NULL DEFAULT '',
  gallery          JSONB NOT NULL DEFAULT '[]',
  colorways        JSONB NOT NULL DEFAULT '[]',   -- [{ name, hex, productSlug }]
  rating           NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  reviews_count    INTEGER NOT NULL DEFAULT 0,
  tag              TEXT NOT NULL DEFAULT '',
  stock            INTEGER CHECK (stock >= 0),     -- NULL = made to order (unlimited)
  customizable     BOOLEAN NOT NULL DEFAULT true,
  featured         BOOLEAN NOT NULL DEFAULT false,
  active           BOOLEAN NOT NULL DEFAULT true,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON products (category_key, sort_order);
CREATE TRIGGER products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------- bags/carts
CREATE TABLE carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'converted', 'abandoned')),
  email      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX carts_status_idx ON carts (status, updated_at DESC);
CREATE TRIGGER carts_updated BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE cart_items (
  id            SERIAL PRIMARY KEY,
  cart_id       UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity      INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  size          TEXT NOT NULL DEFAULT '',
  customization JSONB,                             -- bespoke fit selections; NULL = standard size
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX cart_items_cart_idx ON cart_items (cart_id);

-- --------------------------------------------------------------------- orders
CREATE SEQUENCE order_number_seq START 100001;

CREATE TABLE orders (
  id                  SERIAL PRIMARY KEY,
  order_number        TEXT NOT NULL UNIQUE DEFAULT ('SUIT-' || nextval('order_number_seq')),
  cart_id             UUID REFERENCES carts(id) ON DELETE SET NULL,
  customer_name       TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL DEFAULT '',
  shipping_address    JSONB NOT NULL,
  subtotal            NUMERIC(12, 2) NOT NULL,
  customization_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_fee        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount            NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total               NUMERIC(12, 2) NOT NULL,
  payment_method      TEXT NOT NULL DEFAULT 'cod',
  payment_status      TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'confirmed', 'in_tailoring', 'shipped', 'delivered', 'cancelled')),
  notes               TEXT NOT NULL DEFAULT '',
  admin_notes         TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX orders_created_idx ON orders (created_at DESC);
CREATE INDEX orders_status_idx ON orders (status);
CREATE INDEX orders_email_idx ON orders (lower(email));
CREATE TRIGGER orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE order_items (
  id                SERIAL PRIMARY KEY,
  order_id          INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_slug      TEXT NOT NULL,
  product_name      TEXT NOT NULL,
  image             TEXT NOT NULL DEFAULT '',
  quantity          INTEGER NOT NULL,
  size              TEXT NOT NULL DEFAULT '',
  customization     JSONB,
  unit_price        NUMERIC(12, 2) NOT NULL,
  customization_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  line_total        NUMERIC(12, 2) NOT NULL
);
CREATE INDEX order_items_order_idx ON order_items (order_id);

CREATE TABLE order_status_history (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  note       TEXT NOT NULL DEFAULT '',
  changed_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX order_status_history_order_idx ON order_status_history (order_id, created_at);

-- ---------------------------------------------------------- CMS page content
CREATE TABLE content_sections (
  key        TEXT PRIMARY KEY,                     -- e.g. "header", "aboutPage"
  data       JSONB NOT NULL,
  updated_by INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------- media (images stored in Postgres)
CREATE TABLE media (
  id            SERIAL PRIMARY KEY,
  filename      TEXT NOT NULL,
  original_name TEXT NOT NULL DEFAULT '',
  mime_type     TEXT NOT NULL,
  size          INTEGER NOT NULL,
  data          BYTEA NOT NULL,
  alt           TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------- newsletter
CREATE TABLE subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  source     TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------- settings
CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
