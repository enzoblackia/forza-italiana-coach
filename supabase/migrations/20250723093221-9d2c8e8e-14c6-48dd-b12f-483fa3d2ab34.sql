-- Update user roles to only have admin and user
-- First, update existing 'client' roles to 'user'
UPDATE public.user_roles 
SET role = 'user'::app_role 
WHERE role = 'client'::app_role;

-- Drop the old enum and create a new one with only admin and user
ALTER TYPE app_role RENAME TO app_role_old;

CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Update the user_roles table to use the new enum
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE app_role USING role::text::app_role;

-- Update all functions that reference the old enum
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role_old);
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Drop the old enum
DROP TYPE app_role_old;

-- Create nutrition tracking table
CREATE TABLE public.nutrition_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name VARCHAR(255) NOT NULL,
  food_category VARCHAR(100), -- es: 'proteine', 'carboidrati', 'verdure', 'frutta', 'grassi'
  quantity DECIMAL(8,2),
  unit VARCHAR(20), -- es: 'g', 'ml', 'porzioni'
  calories DECIMAL(8,2),
  proteins DECIMAL(8,2),
  carbs DECIMAL(8,2),
  fats DECIMAL(8,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily nutrition summary table
CREATE TABLE public.daily_nutrition_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  total_calories DECIMAL(8,2) DEFAULT 0,
  total_proteins DECIMAL(8,2) DEFAULT 0,
  total_carbs DECIMAL(8,2) DEFAULT 0,
  total_fats DECIMAL(8,2) DEFAULT 0,
  meals_logged INTEGER DEFAULT 0,
  hydration_goal_met BOOLEAN DEFAULT false,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, summary_date)
);

-- Enable RLS for nutrition tables
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_nutrition_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nutrition_logs
CREATE POLICY "Users can manage their own nutrition logs"
ON public.nutrition_logs
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all nutrition logs"
ON public.nutrition_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for daily_nutrition_summary
CREATE POLICY "Users can manage their own nutrition summary"
ON public.daily_nutrition_summary
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all nutrition summaries"
ON public.daily_nutrition_summary
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for better performance
CREATE INDEX idx_nutrition_logs_user_date ON public.nutrition_logs(user_id, log_date);
CREATE INDEX idx_nutrition_logs_meal_type ON public.nutrition_logs(meal_type);
CREATE INDEX idx_daily_nutrition_user_date ON public.daily_nutrition_summary(user_id, summary_date);

-- Add triggers for updated_at columns
CREATE TRIGGER update_nutrition_logs_updated_at
  BEFORE UPDATE ON public.nutrition_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_nutrition_summary_updated_at
  BEFORE UPDATE ON public.daily_nutrition_summary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();