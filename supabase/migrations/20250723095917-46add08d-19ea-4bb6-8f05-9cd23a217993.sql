-- Drop and recreate the app_role enum properly
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Recreate the enum
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'user');

-- Fix the user_roles table to use the new enum
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;

-- Update the handle_new_user function to work properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  
  -- Assign default role using the correct enum type
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client'::public.app_role);
  
  RETURN new;
END;
$$;