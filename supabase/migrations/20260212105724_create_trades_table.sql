create table public.trades (
    id uuid primary key default gen_random_uuid(),
    owner_id text references public.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    title text not null,
    description text,
    images text[] default '{}',
    metadata jsonb default '{}'::jsonb,
    looking_for text,
    cash_adjustment numeric default 0,
    location_name text,
    status text default 'active' check (status in ('active', 'traded', 'hidden', 'expired')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.trades enable row level security;

create policy "Trades are viewable by everyone"
on public.trades for select using (status = 'active');

create policy "Users can insert their own trades"
on public.trades for insert with check ((select public.clerk_user_id()) = owner_id);

create policy "Users can update their own trades"
on public.trades for update using ((select public.clerk_user_id()) = owner_id);

create policy "Users can delete their own trades"
on public.trades for delete using ((select public.clerk_user_id()) = owner_id);

create trigger on_trades_updated
    before update on public.trades
    for each row execute procedure public.handle_updated_at();

create index idx_trades_owner_id on public.trades(owner_id);
create index idx_trades_category_id on public.trades(category_id);