-- Create staff table for extended employee information
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  manager_id UUID REFERENCES public.staff(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create work_schedules table for managing staff working hours
CREATE TABLE public.work_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working_day BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(staff_id, day_of_week)
);

-- Create time_logs table for tracking actual work hours
CREATE TABLE public.time_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  break_duration INTEGER DEFAULT 0, -- in minutes
  total_hours DECIMAL(4,2),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff table
CREATE POLICY "Admins can manage all staff"
ON public.staff
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view their own record"
ON public.staff
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for work_schedules table
CREATE POLICY "Admins can manage all schedules"
ON public.work_schedules
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = work_schedules.staff_id 
    AND s.user_id = auth.uid()
  )
);

-- RLS Policies for time_logs table
CREATE POLICY "Admins can manage all time logs"
ON public.time_logs
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view their own time logs"
ON public.time_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = time_logs.staff_id 
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Staff can insert their own time logs"
ON public.time_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = time_logs.staff_id 
    AND s.user_id = auth.uid()
  )
);

-- Add indexes for better performance
CREATE INDEX idx_staff_user_id ON public.staff(user_id);
CREATE INDEX idx_staff_status ON public.staff(status);
CREATE INDEX idx_work_schedules_staff_id ON public.work_schedules(staff_id);
CREATE INDEX idx_time_logs_staff_id ON public.time_logs(staff_id);
CREATE INDEX idx_time_logs_date ON public.time_logs(date);

-- Add triggers for updated_at columns
CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_schedules_updated_at
  BEFORE UPDATE ON public.work_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_logs_updated_at
  BEFORE UPDATE ON public.time_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();