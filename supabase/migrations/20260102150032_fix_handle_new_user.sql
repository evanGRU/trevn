create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
avatar uuid;
  username text;
  avatar_text text;
begin
  username := coalesce(new.raw_user_meta_data->>'username', 'NewUser');

  avatar_text := new.raw_user_meta_data->>'defaultAvatarId';

  avatar := coalesce(avatar_text, 'e66eead5-0317-423a-b055-e22cdd810d86')::uuid;

insert into public.profiles (id, username, avatar_id)
values (new.id, username, avatar);

return new;
end;
$$;
