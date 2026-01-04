create or replace function public.kick_group_member(
  p_group_id text,
  p_user_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
v_owner uuid;
begin
  -- check auth
  if auth.uid() is null then
    raise exception 'not_authenticated';
end if;

  -- get owner
select created_by
into v_owner
from public.groups
where id = p_group_id;

if v_owner is null then
    raise exception 'group_not_found';
end if;

  -- check rights
  if v_owner <> auth.uid() then
    raise exception 'forbidden';
end if;

  -- owner cant kick himself
  if p_user_id = v_owner then
    raise exception 'cannot_kick_owner';
end if;

  -- delete member
delete from public.groups_members
where group_id = p_group_id
  and user_id = p_user_id;

if not found then
    raise exception 'member_not_found';
end if;

end;
$$;

grant execute on function public.kick_group_member(text, uuid) to authenticated;
