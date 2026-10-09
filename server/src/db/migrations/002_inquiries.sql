-- Customer requests captured on the storefront (fabric swatch requests, contact messages, ...)
CREATE TABLE inquiries (
  id         SERIAL PRIMARY KEY,
  type       TEXT NOT NULL DEFAULT 'contact',      -- e.g. "swatch_request", "contact", "appointment"
  name       TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  address    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  subject    TEXT NOT NULL DEFAULT '',             -- e.g. the fabric name for a swatch request
  status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX inquiries_created_idx ON inquiries (status, created_at DESC);
CREATE TRIGGER inquiries_updated BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
