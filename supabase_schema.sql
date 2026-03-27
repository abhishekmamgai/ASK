-- 🚨 RUN THIS IN SUPABASE SQL EDITOR 🚨
-- This will fix everything once and for all.

-- 0. CLEANUP (Optional but recommended)
DROP TABLE IF EXISTS public.files CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY, -- Associated with auth.users id
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'client')) DEFAULT 'client',
    company_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES public.profiles(id),
    status TEXT CHECK (status IN ('not-started', 'in-progress', 'on-hold', 'completed')) DEFAULT 'not-started',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    deadline DATE,
    budget TEXT,
    team_size INTEGER DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ISSUES
CREATE TABLE public.issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')) DEFAULT 'open',
    assigned_to TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TASKS (Kanban)
CREATE TABLE public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo',
    assigned_to TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MESSAGES
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id),
    recipient_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DISABLE RLS (For easier testing/fixing)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- 7. REALTIME
-- Try to drop publication first to avoid errors
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- 8. SEED DEFAULT ADMIN (To prevent foreign key errors for messages)
INSERT INTO public.profiles (id, name, email, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'ASK Admin', 'infoasktechbusiness@gmail.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 🛑 IMPORTANT: AFTER RUNNING THIS, RUN THIS COMMAND TO REFRESH:
NOTIFY pgrst, 'reload schema';
