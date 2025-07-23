-- Add foreign key relationships and fix the staff table structure

-- First, add the missing foreign key constraint to staff table
ALTER TABLE public.staff 
ADD CONSTRAINT staff_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);

-- Update the staff table to ensure data consistency
-- First check if there are any orphaned records
DELETE FROM public.staff WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add some sample data for testing
-- Insert a staff record for the current admin user if it doesn't exist
INSERT INTO public.staff (user_id, employee_id, position, department, hire_date, status)
SELECT 
  u.id,
  'EMP001',
  'Administrator',
  'Management', 
  CURRENT_DATE,
  'active'
FROM auth.users u 
JOIN public.user_roles ur ON u.id = ur.user_id 
WHERE ur.role = 'admin'
AND NOT EXISTS (SELECT 1 FROM public.staff s WHERE s.user_id = u.id);