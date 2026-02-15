create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name_key text not null,
    icon_name text,
    parent_id uuid references public.categories(id) on delete cascade,
    slug text unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
on public.categories for select using (true);

create trigger on_categories_updated
    before update on public.categories
    for each row execute procedure public.handle_updated_at();

create index idx_categories_parent_id on public.categories(parent_id);