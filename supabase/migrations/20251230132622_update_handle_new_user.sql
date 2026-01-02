create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
insert into public.profiles (id, username, avatar_id)
values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'defaultAvatarId');
return new;
end;
$$;