-- Make department optional in staff table
ALTER TABLE public.staff 
ALTER COLUMN department DROP NOT NULL;

-- Add a default value for department
ALTER TABLE public.staff 
ALTER COLUMN department SET DEFAULT 'General';