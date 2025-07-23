-- Make employee_id optional in staff table
ALTER TABLE public.staff 
ALTER COLUMN employee_id DROP NOT NULL;

-- Add a default value function for employee_id when needed
CREATE OR REPLACE FUNCTION generate_employee_id() 
RETURNS TEXT AS $$
BEGIN
  RETURN 'EMP' || LPAD((COALESCE((SELECT MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)) FROM staff WHERE employee_id ~ '^EMP[0-9]+$'), 0) + 1)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;