-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Job Postings Table
create table if not exists public.postings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    company text not null,
    location text not null,
    salary text,
    description text
);

-- 2. Ideas Table (Internal Projects)
create table if not exists public.ideas (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    department text, -- "Entity" in UI
    description text,
    total_hours integer default 0,
    participants_count integer default 0
);

-- 3. Applications Table (Job Applications)
create table if not exists public.applications (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    posting_id uuid references public.postings(id) on delete set null,
    full_name text not null,
    email text not null,
    phone text,
    linkedin_url text,
    resume_url text -- Stores the filename in storage
);

-- 4. Collaborators Table (Idea Participants)
create table if not exists public.collaborators (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    idea_id uuid references public.ideas(id) on delete cascade,
    full_name text not null,
    email text not null,
    phone text,
    committed_hours integer not null
);

-- 5. Prospects Table (Referrals/Leads)
create table if not exists public.prospects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    target_type text, -- 'talent' or 'decision_maker'
    recommender_name text,
    recommender_email text,
    recommender_phone text,
    prospect_name text,
    prospect_email text,
    prospect_phone text,
    willing_to_connect boolean default false
);

-- 6. Storage Bucket for Resumes
-- Create a private bucket named 'resumes'
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- 7. RPC Function: increment_idea_stats
-- Used to atomically update idea stats when a collaborator joins
create or replace function public.increment_idea_stats(row_id uuid, h_count int)
returns void
language plpgsql
security definer
as $$
begin
  update public.ideas
  set 
    total_hours = total_hours + h_count, 
    participants_count = participants_count + 1
  where id = row_id;
end;
$$;

-- 8. Row Level Security (RLS) Policies
-- Even though the API uses the Service Role (which bypasses RLS), 
-- these are best practices to prevent accidental public access if keys are leaked.

-- Enable RLS on all tables
alter table public.postings enable row level security;
alter table public.applications enable row level security;
alter table public.ideas enable row level security;
alter table public.collaborators enable row level security;
alter table public.prospects enable row level security;

-- Postings: Public Read (Job Board needs to see them), Private Write (Admin only)
create policy "Allow public read access to postings"
on public.postings for select
to public
using (true);

-- Ideas: Public Read (Ideas page), Private Write (Admin only)
create policy "Allow public read access to ideas"
on public.ideas for select
to public
using (true);

-- Applications: Public Insert (Anyone can apply), Private Read (Admin only)
create policy "Allow public insert to applications"
on public.applications for insert
to public
with check (true);

-- Collaborators: Public Insert (Anyone can join), Private Read (Admin only)
create policy "Allow public insert to collaborators"
on public.collaborators for insert
to public
with check (true);

-- Prospects: Public Insert (Anyone can refer), Private Read (Admin only)
create policy "Allow public insert to prospects"
on public.prospects for insert
to public
with check (true);

-- 9. Storage Policies
-- Only allow authenticated (Service Role) to handle files.
-- Public/Anon access is denied by default if no policy exists.
-- But we explicitly deny public access just in case.
create policy "Deny public access to resumes"
on storage.objects
for all
to public
using (false);
