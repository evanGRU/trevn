create policy "Member can leave group"
on public.groups_members
for delete
to authenticated
using (
    user_id = auth.uid()
);

create or replace function public.delete_group(
    p_group_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
declare
    v_owner_id uuid;
    v_avatar_id uuid;
    v_is_custom boolean;
begin
      -- Auth check
    if auth.uid() is null then
        raise exception 'not_authenticated';
    end if;

    -- Récupérer owner et avatar du groupe
    select owner_id, avatar_id
    into v_owner_id, v_avatar_id
    from public.groups
    where id = p_group_id;

    if v_owner_id is null then
        raise exception 'group_not_found';
    end if;

    -- Vérifier que l'utilisateur est owner
    if v_owner_id <> auth.uid() then
        raise exception 'not_owner';
    end if;

    -- Supprimer l’avatar s’il existe et s’il est custom
    if v_avatar_id is not null then
        select is_custom
        into v_is_custom
        from public.avatars
        where id = v_avatar_id;

        if v_is_custom = true then
            delete from public.avatars
            where id = v_avatar_id;
        end if;
    end if;

    -- Supprimer le groupe
    delete from public.groups
    where id = p_group_id;

    if not found then
        raise exception 'delete_failed';
    end if;

end;
$$;

grant execute on function public.delete_group(text) to authenticated;
