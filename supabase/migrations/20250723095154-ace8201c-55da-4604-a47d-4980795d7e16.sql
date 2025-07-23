-- Update the app_role enum to include 'user' role
ALTER TYPE public.app_role ADD VALUE 'user';

-- Update the handle_new_user function to use 'client' instead of 'user' temporarily
-- We'll keep using 'client' as the default role for now
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
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client'::app_role);
  
  RETURN new;
END;
$$;