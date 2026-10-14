-- Suitoholic migration 003: Partial Payment (20% Advance + COD) and Low Stock Alerts

-- 1. Extend orders table to support partial payments
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded', 'failed'));

ALTER TABLE orders ADD COLUMN IF NOT EXISTS advance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0;

-- 2. Audit log for low-stock alert notifications (prevents spam & tracks deliverability)
CREATE TABLE IF NOT EXISTS stock_alert_logs (
  id           SERIAL PRIMARY KEY,
  product_id   INTEGER REFERENCES products(id) ON DELETE CASCADE,
  stock_level  INTEGER NOT NULL,
  channel      TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  recipient    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stock_alert_logs_product_idx ON stock_alert_logs (product_id, created_at DESC);

-- 3. Pre-populate default settings for low stock and partial payment if store settings exist
UPDATE settings
SET value = value || '{
  "lowStockThreshold": 10,
  "lowStockNotifyEmail": true,
  "lowStockNotifyWhatsapp": false,
  "lowStockEmail": "",
  "lowStockPhone": "",
  "partialPaymentEnabled": true,
  "advancePaymentPercentage": 20
}'::jsonb
WHERE key = 'store' AND NOT (value ? 'lowStockThreshold');
