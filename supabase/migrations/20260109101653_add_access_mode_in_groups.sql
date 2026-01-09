create type group_access_mode as enum (
  'open',
  'moderated',
  'closed'
);

alter table public.groups
    add column access_mode text not null default 'open';

update public.groups
set access_mode = 'open'
where access_mode is null;


drop function if exists public.create_group_with_avatar(
    text,
    text,
    uuid
);

create function public.create_group_with_avatar(
    p_name text,
    p_invite_code text,
    p_avatar_id uuid,
    p_access_mode group_access_mode default 'open'
)
    returns text
    language plpgsql
security definer
as $$
declare
v_group_id text;
    v_is_custom boolean;
    v_rule_id uuid;
    v_rules jsonb := '[
        {
            "code": "add_games",
            "value": true,
            "roles": {"moderator": true, "member": true}
        },
        {
            "code": "delete_games",
            "value": true,
            "roles": {"moderator": true, "member": true}
        },
        {
            "code": "like_games",
            "value": true,
            "roles": {"moderator": true, "member": true}
        }
    ]';
    v_rule jsonb;
    v_role text;
    v_can_execute boolean;
begin
    -- create group
    insert into public.groups (
        name,
        invite_code,
        avatar_id,
        owner_id,
        access_mode
    )
    values (
           p_name,
           p_invite_code,
           p_avatar_id,
           auth.uid(),
           p_access_mode
       )
    returning id into v_group_id;

    -- add creator as owner
    insert into public.groups_members (group_id, user_id, role)
    values (v_group_id, auth.uid(), 'owner');

    -- create and add all default rules
    for v_rule in select * from jsonb_array_elements(v_rules) loop
        insert into public.groups_rules (group_id, code, value)
                  values (v_group_id, v_rule->>'code', (v_rule->>'value')::boolean)
                      returning id into v_rule_id;

        -- add rights for each role
        for v_role, v_can_execute in
            select key, value::boolean
            from jsonb_each(v_rule->'roles')
                loop
            insert into public.groups_rules_roles (rule_id, role, can_execute)
            values (v_rule_id, v_role, v_can_execute);
        end loop;
    end loop;

    if p_avatar_id is not null then
        select is_custom
        into v_is_custom
        from public.avatars
        where id = p_avatar_id;

        if v_is_custom = true then
            update public.avatars
            set group_id = v_group_id
            where id = p_avatar_id;
        end if;
    end if;

return v_group_id;

exception
      when others then
        raise exception 'create_group_with_avatar failed';
end;
$$;

grant execute on function public.create_group_with_avatar(text, text, uuid, group_access_mode) to authenticated;