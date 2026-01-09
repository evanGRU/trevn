create policy "group_owner_can_update"
on public.groups
for update
using (owner_id = auth.uid());