ALTER TABLE public.profiles
    RENAME COLUMN avatar_url TO avatar_id;

ALTER TABLE public.profiles
ALTER COLUMN avatar_id
TYPE uuid USING avatar_id::uuid;

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_avatar_id_fkey
        FOREIGN KEY (avatar_id)
            REFERENCES avatars(id);