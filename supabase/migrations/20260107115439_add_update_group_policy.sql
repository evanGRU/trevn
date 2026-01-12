create policy "group_owner_can_update"
on public.groups
for update
using (created_by = auth.uid());