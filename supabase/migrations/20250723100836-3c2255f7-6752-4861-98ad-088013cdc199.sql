-- Disable the problematic trigger completely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the trigger function that's causing issues
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Make sure staff table doesn't have NOT NULL constraint on user_id temporarily
ALTER TABLE public.staff ALTER COLUMN user_id DROP NOT NULL;

-- Add a temporary email field to staff table for identification
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS temp_email TEXT;