alter table public.groups
    rename column created_by to owner_id;

alter table public.groups
    add constraint groups_owner_id_fkey
        foreign key (owner_id)
            references auth.users(id)
            on delete cascade;

alter table public.groups
drop constraint groups_created_by_fkey;

alter table public.groups
    alter column owner_id set not null;

create index if not exists groups_owner_id_idx on public.groups(owner_id);

drop policy if exists "Users must be authenticated to create groups"
on public.groups;



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
insert into public.groups (name, invite_code, avatar_id, owner_id)
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

exception
  when others then
    raise exception 'create_group_with_avatar failed';
end;
$$;

grant execute on function public.create_group_with_avatar(text, text, uuid) to authenticated;



drop function if exists public.kick_group_member(
    text,
    uuid
);

create function public.kick_group_member(
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
select owner_id
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
