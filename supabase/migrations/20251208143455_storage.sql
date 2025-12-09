-- ============================================
-- STORAGE BUCKET : avatars
-- ============================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- ============================================
-- POLICIES
-- ============================================

-- Drop existing policies
drop policy if exists "Public read avatars" on storage.objects;
drop policy if exists "Allow authenticated users to upload own avatar" on storage.objects;
drop policy if exists "Allow authenticated users to update own avatar" on storage.objects;


-- Policies for avatars bucket
create policy "Public read avatars"
on storage.objects for select
    using (
    bucket_id = 'avatars'
);

create policy "Allow authenticated users to upload own avatar"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
);

create policy "Allow authenticated users to update own avatar"
on storage.objects for update
to authenticated
using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
)
with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
);