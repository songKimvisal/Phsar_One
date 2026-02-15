create table public.products (
    id uuid primary key default gen_random_uuid(),
    seller_id text references public.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    title text not null,
    description text,
    price numeric not null check (price >= 0),
    is_negotiable boolean default false,
    metadata jsonb default '{}'::jsonb,
    images text[] default '{}',
    location_name text,
    status text default 'active' check (status in ('active', 'sold', 'hidden', 'expired')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
on public.products for select using (status = 'active');

create policy "Users can insert their own products"
on public.products for insert with check ((select public.clerk_user_id()) = seller_id);

create policy "Users can update their own products"
on public.products for update using ((select public.clerk_user_id()) = seller_id);

create policy "Users can delete their own products"
on public.products for delete using ((select public.clerk_user_id()) = seller_id);

create trigger on_products_updated
    before update on public.products
    for each row execute procedure public.handle_updated_at();

create index idx_products_seller_id on public.products(seller_id);
create index idx_products_category_id on public.products(category_id);
create index idx_products_status on public.products(status);