create policy "Users can cancel own subscription"
on public.subscriptions for update
using ((select public.clerk_user_id()) = user_id)
with check ((select public.clerk_user_id()) = user_id);

create or replace function public.sync_user_type()
returns trigger as $$
begin
    if (
        new.status in ('active', 'trailing', 'past_due')
        or (
            new.status = 'canceled'
            and new.current_period_end is not null
            and new.current_period_end > now()
        )
    ) then
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
