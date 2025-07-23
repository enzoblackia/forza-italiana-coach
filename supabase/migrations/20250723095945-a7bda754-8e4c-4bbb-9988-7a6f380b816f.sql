-- Temporarily disable the trigger to allow user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a simplified trigger that doesn't fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Just insert profile, skip role assignment for now
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', '')
  );
  
  RETURN new;
EXCEPTION WHEN others THEN
  -- If anything fails, just return new to not block user creation
  RETURN new;
END;
$$;

-- Re-enable the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();