-- Migration: Add Reroll Token System
-- Run this in your Supabase SQL Editor

-- 1) Add reroll_tokens column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS reroll_tokens INTEGER DEFAULT 4;

-- 2) Update credits_balance default for new users (existing column)
ALTER TABLE public.users
  ALTER COLUMN credits_balance SET DEFAULT 1;

-- 3) Add reroll-related columns to generations table
ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS is_reroll BOOLEAN DEFAULT FALSE;

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS parent_generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL;

ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS reroll_count INTEGER DEFAULT 0;

-- 4) Create index for faster parent generation lookups
CREATE INDEX IF NOT EXISTS idx_generations_parent_id ON public.generations (parent_generation_id);

-- 5) Update existing users to have reroll tokens (optional - for existing accounts)
UPDATE public.users
SET reroll_tokens = 4
WHERE reroll_tokens IS NULL;

-- 6) Create function to update reroll tokens
CREATE OR REPLACE FUNCTION public.update_reroll_tokens(
  user_uuid UUID,
  token_change INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET reroll_tokens = GREATEST(0, reroll_tokens + token_change),
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7) Create function to check if user has enough reroll tokens
CREATE OR REPLACE FUNCTION public.check_reroll_tokens(
  user_uuid UUID,
  required_tokens INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_tokens INTEGER;
BEGIN
  SELECT reroll_tokens INTO current_tokens
  FROM public.users
  WHERE id = user_uuid;
  
  RETURN COALESCE(current_tokens, 0) >= required_tokens;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8) Grant yourself unlimited credits for testing (replace with your email)
-- UNCOMMENT AND UPDATE THE EMAIL BELOW:
-- UPDATE public.users 
-- SET 
--   credits_balance = 999999,
--   reroll_tokens = 999999,
--   free_credit_granted = true,
--   updated_at = NOW()
-- WHERE email = 'YOUR_EMAIL_HERE@example.com';

-- Verification queries (optional - run to check results)
-- SELECT id, email, credits_balance, reroll_tokens, free_credit_granted 
-- FROM public.users 
-- WHERE email = 'YOUR_EMAIL_HERE@example.com';

