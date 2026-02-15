create table public.favorites (
    id uuid primary key default gen_random_uuid(),
    user_id text references public.users(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade,
    trade_id uuid references public.trades(id) on delete cascade,
    created_at timestamptz default now(),

    constraint must_favorite_something check (product_id is not null or trade_id is not null),
    constraint unique_product_favorite unique (user_id, product_id),
    constraint unique_trade_favorite unique (user_id, trade_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorite"
on public.favorites for select
using ((select public.clerk_user_id()) = user_id);

create policy "Users can add favorites"
on public.favorites for insert
with check ((select public.clerk_user_id()) = user_id);

create index idx_favorites_user on public.favorites(user_id);