-- Update existing users with 'client' role to 'admin' role for the current user
-- Since this is the first user, they should be admin
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE role = 'client'::app_role;