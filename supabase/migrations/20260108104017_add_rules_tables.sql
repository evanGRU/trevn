alter table public.groups_members
    add column role text not null default 'member';

alter table public.groups_members
    add constraint groups_members_role_check
        check (role in ('owner', 'moderator', 'member'));

update public.groups_members gm
set role = 'owner'
    from public.groups g
where gm.group_id = g.id
  and gm.user_id = g.owner_id;

create index if not exists groups_members_group_id_role_idx
    on public.groups_members(group_id, role);



create table public.groups_rules (
                                    id uuid default gen_random_uuid() primary key,
                                    group_id text not null references public.groups(id) on delete cascade,
                                    code text not null,
                                    value boolean not null default false,
                                    created_at timestamp with time zone default now(),
                                    updated_at timestamp with time zone default now(),
                                    constraint unique_group_code unique (group_id, code)
);

create table public.groups_rules_roles (
                                         id uuid default gen_random_uuid() primary key,
                                         rule_id uuid not null references public.groups_rules(id) on delete cascade,
                                         role text not null,
                                         can_execute boolean not null default false,
                                         created_at timestamptz not null default now()
);

create index if not exists groups_rules_group_id_idx on public.groups_rules(group_id);
create index if not exists groups_rules_roles_rule_id_idx on public.groups_rules_roles(rule_id);


create or replace function public.update_groups_rules_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
return new;
end;
$$;

create trigger groups_rules_updated_at_trigger
    before update on public.groups_rules
    for each row
    execute function public.update_groups_rules_timestamp();


create or replace function public.can_user_execute_rule(
    p_group_id text,
    p_user_id uuid,
    p_rule_code text
)
returns boolean
language plpgsql
security definer
as $$
declare
    v_rule_id uuid;
    v_role text;
    v_can_execute boolean;
begin
    select id into v_rule_id
    from public.groups_rules
    where group_id = p_group_id
      and code = p_rule_code
      and value = true;

    if v_rule_id is null then
            return false;
    end if;

    select role into v_role
    from public.groups_members
    where group_id = p_group_id
      and user_id = p_user_id;

    if v_role is null then
            return false;
    end if;

    select can_execute into v_can_execute
    from public.groups_rules_roles
    where rule_id = v_rule_id
      and role = v_role;

    if v_can_execute is null then
            return false;
    end if;

    return v_can_execute;
end;
$$;

grant execute on function public.can_user_execute_rule(text, uuid, text) to authenticated;
