do $$
declare
    v_group record;
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
    -- Boucle sur tous les groupes existants
    for v_group in select id from public.groups loop

        -- Boucle sur chaque règle
        for v_rule in select * from jsonb_array_elements(v_rules) loop

            -- Insérer la règle si elle n'existe pas
            insert into public.groups_rules (group_id, code, value)

            select v_group.id, v_rule->>'code', (v_rule->>'value')::boolean
            where not exists (
                select 1 from public.groups_rules
                where group_id = v_group.id
              and code = v_rule->>'code'
                )
                returning id into v_rule_id;

            -- Ajouter les droits pour moderator et member
            if v_rule_id is not null then
                for v_role, v_can_execute in
                    select key, value::boolean
                    from jsonb_each(v_rule->'roles')
                        loop
                    insert into public.groups_rules_roles (rule_id, role, can_execute)
                    values (v_rule_id, v_role, v_can_execute);
                end loop;
            end if;

        end loop;
    end loop;
end;
$$;



drop function if exists public.create_group_with_avatar(
    text,
    text,
    uuid
    );

create function public.create_group_with_avatar(
    p_name text,
    p_invite_code text,
    p_avatar_id uuid
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
    insert into public.groups (name, invite_code, avatar_id, owner_id)
    values (p_name, p_invite_code, p_avatar_id, auth.uid())
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

grant execute on function public.create_group_with_avatar(text, text, uuid) to authenticated;