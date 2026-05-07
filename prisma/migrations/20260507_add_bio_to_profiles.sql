-- Migration: Add bio column to profiles table
-- Description: Ensures the profiles table has a bio column for user descriptions.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Verify columns (optional check)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';
