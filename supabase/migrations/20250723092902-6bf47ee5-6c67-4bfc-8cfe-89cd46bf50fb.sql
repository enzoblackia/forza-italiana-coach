-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscle_groups TEXT[] DEFAULT '{}',
  difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  equipment VARCHAR(255),
  video_url TEXT,
  instructions TEXT,
  sets INTEGER DEFAULT 3,
  reps VARCHAR(50) DEFAULT '10-12',
  rest_time INTEGER DEFAULT 60, -- seconds
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for exercise videos
INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-videos', 'exercise-videos', true);

-- Enable RLS for exercises table
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercises table
CREATE POLICY "Everyone can view public exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (is_public = true);

CREATE POLICY "Admins can manage all exercises"
ON public.exercises
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "Users can create their own exercises"
ON public.exercises
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own exercises"
ON public.exercises
FOR UPDATE
TO authenticated
USING (created_by = auth.uid());

-- Storage policies for exercise videos
CREATE POLICY "Anyone can view exercise videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'exercise-videos');

CREATE POLICY "Authenticated users can upload exercise videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exercise-videos');

CREATE POLICY "Users can update their own exercise videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'exercise-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own exercise videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'exercise-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add indexes for better performance
CREATE INDEX idx_exercises_muscle_groups ON public.exercises USING GIN(muscle_groups);
CREATE INDEX idx_exercises_difficulty ON public.exercises(difficulty_level);
CREATE INDEX idx_exercises_created_by ON public.exercises(created_by);
CREATE INDEX idx_exercises_public ON public.exercises(is_public);

-- Add trigger for updated_at
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();