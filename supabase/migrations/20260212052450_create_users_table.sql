create table public.users (
    id text primary key,
    email text unique not null,
    first_name text,
    last_name text,
    avatar_url text,
    phone text,
    user_type text default 'regular' check (user_type in ('regular', 'starter', 'pro', 'business')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Public profiles are viewable by everyone." on public.users
    for select using (true);

-- Helper function to get Clerk User ID from JWT
create or replace function public.clerk_user_id()
returns text as $$
    select nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub';
$$ language sql stable
set search_path = '';

create policy "Users can insert their own profile." on public.users
    for insert with check ((select public.clerk_user_id()) = id);

create policy "Users can update own profile." on public.users
    for update using ((select public.clerk_user_id()) = id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql
set search_path = '';

create trigger on_users_updated
    before update on public.users
    for each row execute procedure public.handle_updated_at();