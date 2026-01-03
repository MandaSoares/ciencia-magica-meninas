
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  interests TEXT[] DEFAULT '{}',
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table for tracking progress per STEM area
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stem_area TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_lesson INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stem_area)
);

-- Create completed_lessons table
CREATE TABLE public.completed_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stem_area TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stem_area, lesson_id)
);

-- Create completed_modules table
CREATE TABLE public.completed_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stem_area TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stem_area, module_id)
);

-- Create completed_experiments table
CREATE TABLE public.completed_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stem_area TEXT NOT NULL,
  experiment_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stem_area, experiment_id)
);

-- Create experiment_comments table for forum
CREATE TABLE public.experiment_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  experiment_id TEXT NOT NULL,
  parent_id UUID REFERENCES public.experiment_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_likes table to track who liked what
CREATE TABLE public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.experiment_comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for completed_lessons
CREATE POLICY "Users can view their own completed lessons" ON public.completed_lessons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completed lessons" ON public.completed_lessons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for completed_modules
CREATE POLICY "Users can view their own completed modules" ON public.completed_modules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completed modules" ON public.completed_modules FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for completed_experiments
CREATE POLICY "Users can view their own completed experiments" ON public.completed_experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own completed experiments" ON public.completed_experiments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for experiment_comments (public read, authenticated write)
CREATE POLICY "Anyone can view comments" ON public.experiment_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON public.experiment_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.experiment_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.experiment_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for comment_likes
CREATE POLICY "Anyone can view likes" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert likes" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experiment_comments_updated_at BEFORE UPDATE ON public.experiment_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
