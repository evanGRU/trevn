-- =========================================
-- EXTENSIONS
-- =========================================
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =========================================
-- FUNCTION: nanoid
-- =========================================
create or replace function nanoid(size int) returns text as $$
declare
alphabet text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  alphabet_len int := length(alphabet);
  id text := '';
  i int := 0;
  random_byte bytea;
  idx int;
begin
  if size < 1 then
    raise exception 'size must be at least 1';
end if;

for i in 1..size loop
    random_byte := gen_random_bytes(1);
    idx := (get_byte(random_byte, 0) % alphabet_len) + 1;
    id := id || substr(alphabet, idx, 1);
end loop;

return id;
end;
$$ language plpgsql;

-- =========================================
-- FUNCTION: handle_new_user
-- =========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
insert into public.profiles (id, username)
values (new.id, new.raw_user_meta_data->>'username');
return new;
end;
$$;

-- =========================================
-- TABLE: profiles
-- =========================================
create table if not exists public.profiles (
    id uuid primary key,
    username text unique,
    avatar_url text,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    constraint profiles_id_fkey
    foreign key (id)
    references auth.users(id)
    on delete cascade
    );

-- =========================================
-- TABLE: avatars
-- =========================================
create table if not exists public.avatars (
    id uuid primary key default gen_random_uuid(),
    group_id text,
    type text not null,
    name text,
    is_custom boolean default false,
    created_by uuid,
    created_at timestamp default now(),
    constraint avatars_created_by_fkey
        foreign key (created_by)
        references auth.users(id)
        on delete set null
);

-- =========================================
-- TABLE: groups
-- =========================================
create table if not exists public.groups (
    id text primary key default nanoid(10),
    name text not null,
    description text,
    created_at timestamp with time zone default now(),
    created_by uuid not null default auth.uid(),
    invite_code text unique,
    avatar_id uuid,
    constraint groups_created_by_fkey
        foreign key (created_by)
        references auth.users(id)
        on update cascade
        on delete cascade,
    constraint groups_avatar_id_fkey
        foreign key (avatar_id)
        references public.avatars(id)
        on delete set null
);

-- FK: avatars.group_id → groups.id ON DELETE CASCADE
alter table public.avatars
    add constraint avatars_group_id_fkey
        foreign key (group_id)
            references public.groups(id)
            on delete cascade;

-- =========================================
-- TABLE: groups_members
-- =========================================
create table if not exists public.groups_members (
    id uuid primary key default gen_random_uuid(),
    group_id text,
    user_id uuid,
    created_at timestamp with time zone default now(),
    constraint groups_members_group_id_fkey
        foreign key (group_id)
        references public.groups(id)
        on delete cascade,
    constraint groups_members_user_id_fkey
        foreign key (user_id)
        references auth.users(id)
        on delete cascade
    constraint user_profile_fkey
        foreign key (user_id)
        references profiles(id)
        on delete cascade;
);

-- =========================================
-- TABLE: steam_apps_min
-- =========================================
create table if not exists public.steam_apps_min (
    id bigint primary key,
    name text,
    last_modified bigint
);

-- =========================================
-- TABLE: steam_sync_state
-- =========================================
create table if not exists public.steam_sync_state (
    id text primary key default 'progress',
    last_appid bigint default 0,
    updated_at timestamp with time zone default now()
);

-- =========================================
-- ENABLE RLS AND POLICIES
-- =========================================

-- Enable RLS on tables
alter table public.groups enable row level security;
alter table public.groups_members enable row level security;

-- Policies for groups
create policy "All authenticated users can select all groups"
on public.groups
for select
to authenticated
    using (true);

create policy "Users must be authenticated to create groups"
on public.groups
for insert
to authenticated
with check (auth.uid() IS NOT NULL);

-- Policies for groups_members
create policy "Users can insert their own membership"
on public.groups_members
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can read their memberships"
on public.groups_members
for select
to authenticated
    using (auth.uid() = user_id);

-- =========================================
-- TRIGGERS
-- =========================================
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function handle_new_user();
