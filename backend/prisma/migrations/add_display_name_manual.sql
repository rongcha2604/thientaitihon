-- Migration: Add display_name column to users table
-- Created: 2025-11-05
-- Purpose: Add display_name column for child's display name feature

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "display_name" TEXT;

