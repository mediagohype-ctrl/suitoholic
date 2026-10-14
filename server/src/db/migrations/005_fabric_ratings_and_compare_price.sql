-- Suitoholic migration 005: Add rating, reviews_count and compare_at_price to fabrics

ALTER TABLE fabrics
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS reviews_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compare_at_price TEXT NOT NULL DEFAULT '';
