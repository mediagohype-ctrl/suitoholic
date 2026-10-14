-- Suitoholic migration 006: Add stock column to fabrics table

ALTER TABLE fabrics
  ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 50;
