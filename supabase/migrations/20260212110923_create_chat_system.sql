create table public.conversations (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete set null,
    trade_id uuid references public.trades(id) on delete set null,
    buyer_id text references public.users(id) on delete cascade not null,
    seller_id text references public.users(id) on delete cascade not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create unique index idx_unique_product_chat
on public.conversations (product_id, buyer_id, seller_id)
where product_id is not null;

create unique index idx_unique_trade_chat
on public.conversations (trade_id, buyer_id, seller_id)
where trade_id is not null;

create table public.messages (
    id uuid primary key default gen_random_uuid(),
    conversations_id uuid references public.conversations(id) on delete cascade not null,
    sender_id text references public.users(id) on delete cascade not null,
    content text not null,
    is_read boolean default false,
    created_at timestamptz default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Users can view their own conversations"
on public.conversations for select
using ((select public.clerk_user_id()) in (buyer_id, seller_id));

create policy "Users can start a conversation"
on public.conversations for insert
with check ((select public.clerk_user_id()) = buyer_id);

create policy "Users can view messages in their conversations"
on public.messages for select
using (
    exists (
        select 1 from public.conversations
        where id = conversations_id
        and (select public.clerk_user_id()) in (buyer_id, seller_id)
    )
);

create policy "Users can send messages to their conversations"
on public.messages for insert
with check (
    (select public.clerk_user_id()) = sender_id
    and exists (
        select 1 from public.conversations
        where id = conversations_id
        and (select public.clerk_user_id()) in (buyer_id, seller_id)
    )
);

create or replace function public.update_conversation_timestamp()
returns trigger as $$
begin
    update public.conversations
    set updated_at = now()
    where id = new.conversations_id;
    return new;
end;
$$ language plpgsql set search_path = '';

create trigger on_message_inserted
    after insert on public.messages
    for each row execute procedure public.update_conversation_timestamp();

create index idx_conversations_buyer on public.conversations(buyer_id);
create index idx_conversations_seller on public.conversations(seller_id);
create index idx_messages_conversation on public.messages(conversations_id);