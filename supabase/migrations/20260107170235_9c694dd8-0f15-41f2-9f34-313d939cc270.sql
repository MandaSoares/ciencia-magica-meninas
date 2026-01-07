-- Blog Posts table (editable by admins and moderators)
CREATE TABLE public.blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name text NOT NULL,
    emoji text DEFAULT '📚',
    color_class text DEFAULT 'bg-purple-100',
    read_time text DEFAULT '5 min',
    published boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

-- Admins and moderators can view all posts
CREATE POLICY "Admins and moderators can view all blog posts"
ON public.blog_posts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Admins and moderators can insert posts
CREATE POLICY "Admins and moderators can insert blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Admins can update any post, moderators can update their own
CREATE POLICY "Admins can update any blog post"
ON public.blog_posts
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can update their own blog posts"
ON public.blog_posts
FOR UPDATE
USING (public.has_role(auth.uid(), 'moderator') AND author_id = auth.uid());

-- Only admins can delete posts
CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Learning Path content table
CREATE TABLE public.learning_path_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stem_area text NOT NULL,
    level_number integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon text DEFAULT 'Star',
    difficulty text DEFAULT 'Iniciante',
    points integer DEFAULT 30,
    color text DEFAULT 'bg-purple-500',
    lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(stem_area, level_number)
);

ALTER TABLE public.learning_path_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning path content"
ON public.learning_path_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert learning path content"
ON public.learning_path_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update learning path content"
ON public.learning_path_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete learning path content"
ON public.learning_path_content
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Modules content table
CREATE TABLE public.modules_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stem_area text NOT NULL,
    module_id text NOT NULL UNIQUE,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    color text DEFAULT 'bg-purple-500',
    icon text DEFAULT 'BookOpen',
    total_lessons integer DEFAULT 5,
    estimated_time text DEFAULT '3 horas',
    lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
    final_project jsonb DEFAULT '{}'::jsonb,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.modules_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules content"
ON public.modules_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert modules content"
ON public.modules_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update modules content"
ON public.modules_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete modules content"
ON public.modules_content
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Experiments table for Virtual Lab
CREATE TABLE public.experiments_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stem_area text NOT NULL,
    experiment_id text NOT NULL UNIQUE,
    title text NOT NULL,
    description text NOT NULL,
    difficulty text DEFAULT 'Fácil',
    time text DEFAULT '15 min',
    materials text[] NOT NULL DEFAULT '{}',
    steps text[] NOT NULL DEFAULT '{}',
    icon text DEFAULT 'Beaker',
    color text DEFAULT 'bg-purple-500',
    image text DEFAULT '🧪',
    step_images text[] DEFAULT '{}',
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.experiments_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiments content"
ON public.experiments_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert experiments content"
ON public.experiments_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update experiments content"
ON public.experiments_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete experiments content"
ON public.experiments_content
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Career areas and inspirational women
CREATE TABLE public.career_areas_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    stem_area text NOT NULL,
    career_id text NOT NULL UNIQUE,
    career_name text NOT NULL,
    career_description text NOT NULL,
    salary_range text,
    icon text DEFAULT 'Briefcase',
    women jsonb NOT NULL DEFAULT '[]'::jsonb,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.career_areas_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career areas content"
ON public.career_areas_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert career areas content"
ON public.career_areas_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update career areas content"
ON public.career_areas_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete career areas content"
ON public.career_areas_content
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_learning_path_content_updated_at
BEFORE UPDATE ON public.learning_path_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_content_updated_at
BEFORE UPDATE ON public.modules_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiments_content_updated_at
BEFORE UPDATE ON public.experiments_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_areas_content_updated_at
BEFORE UPDATE ON public.career_areas_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();