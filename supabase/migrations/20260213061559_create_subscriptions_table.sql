create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id text references public.users(id) on delete cascade not null,
    plan_type text check (plan_type in ('starter', 'pro', 'business')),
    status text default 'inactive' check (status in ('active', 'trailing', 'past_due', 'canceled', 'inactive', 'pending_verification')),
    payment_provider text,
    external_id text unique,
    payment_proof_url text,
    current_period_end timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
on public.subscriptions for select
using ((select public.clerk_user_id()) = user_id);

create or replace function public.sync_user_type()
returns trigger as $$
begin
    if (new.status = 'active') then
        update public.users
        set user_type = new.plan_type
        where id = new.user_id;
    else
        update public.users
        set user_type = 'regular'
        where id = new.user_id;
    end if;
    return new;
end;
$$ language plpgsql set search_path = '';

create trigger on_subscription_change
    after insert or update on public.subscriptions
    for each row execute procedure public.sync_user_type();

create trigger on_subscriptions_updated
    before update on public.subscriptions
    for each row execute procedure public.handle_updated_at();