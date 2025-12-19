drop policy "Users can read their memberships" on "public"."groups_members";

create policy "Users can view members of their groups"
on "public"."groups_members"
for select
to authenticated
using (true);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
on "public"."profiles" for select
using ( true );