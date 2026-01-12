DROP policy IF EXISTS "Users can read their memberships" ON "public"."groups_members";

CREATE policy "Users can view members of their groups"
ON "public"."groups_members"
FOR SELECT
TO authenticated
USING (true);


-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE policy "Public profiles are viewable by everyone"
ON "public"."profiles" FOR SELECT
USING ( true );

CREATE POLICY "Users can update their own profile"
ON "public"."profiles" FOR UPDATE
TO authenticated
USING (auth.uid() = id);