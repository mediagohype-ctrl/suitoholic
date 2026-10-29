-- Migration 007: Add gallery column to fabrics table for 6-step customization images
ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]';
