create or replace function public.create_group_with_avatar(
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
begin
  -- Create group
insert into public.groups (name, invite_code, avatar_id, created_by)
values (p_name, p_invite_code, p_avatar_id, auth.uid())
    returning id into v_group_id;

-- Add creator as member
insert into public.groups_members (group_id, user_id)
values (v_group_id, auth.uid());

-- Link avatar to group (optional)
if p_avatar_id is not null then
update public.avatars
set group_id = v_group_id
where id = p_avatar_id;
end if;

return v_group_id;

exception
  when others then
    raise exception 'Transaction failed';
end;
$$;

grant execute on function public.create_group_with_avatar to authenticated;