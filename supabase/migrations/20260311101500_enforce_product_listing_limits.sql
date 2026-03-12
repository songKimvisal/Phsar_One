create or replace function public.max_active_product_listings(plan_type text)
returns integer as $$
begin
    case lower(coalesce(plan_type, 'regular'))
        when 'starter' then return 15;
        when 'pro' then return 50;
        when 'business' then return 9999;
        else return 5;
    end case;
end;
$$ language plpgsql immutable set search_path = '';

create or replace function public.enforce_active_product_listing_limit()
returns trigger as $$
declare
    current_plan_type text;
    active_listing_count integer;
    max_allowed integer;
begin
    if new.status <> 'active' then
        return new;
    end if;

    select user_type
    into current_plan_type
    from public.users
    where id = new.seller_id;

    max_allowed := public.max_active_product_listings(current_plan_type);

    select count(*)
    into active_listing_count
    from public.products
    where seller_id = new.seller_id
      and status = 'active'
      and (tg_op <> 'UPDATE' or id <> new.id);

    if active_listing_count >= max_allowed then
        raise exception 'ACTIVE_LISTING_LIMIT_REACHED'
          using errcode = 'P0001',
                detail = format(
                  'Plan %s allows %s active product listings.',
                  coalesce(current_plan_type, 'regular'),
                  max_allowed
                );
    end if;

    return new;
end;
$$ language plpgsql set search_path = '';

create trigger on_products_enforce_active_listing_limit
    before insert or update on public.products
    for each row execute procedure public.enforce_active_product_listing_limit();
