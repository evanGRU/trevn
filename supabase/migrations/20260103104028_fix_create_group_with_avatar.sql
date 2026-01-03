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
begin
insert into public.groups (name, invite_code, avatar_id, created_by)
values (p_name, p_invite_code, p_avatar_id, auth.uid())
    returning id into v_group_id;

insert into public.groups_members (group_id, user_id)
values (v_group_id, auth.uid());

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
end;
$$;

grant execute on function public.create_group_with_avatar(text, text, uuid) to authenticated;


alter table avatars
    add constraint presets_cannot_have_group
        check (
            is_custom = true OR group_id is null
            );


create policy "Prevent deleting preset avatars"
on avatars
for delete
using (
  is_custom = true
);