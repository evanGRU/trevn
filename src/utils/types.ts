export type Profile = {
    id: string;
    username: string;
    avatar_url: string | null;
} | null;

export type GroupMembers = {
    user_id: string;
}

export type Avatar = {
    id: string;
    name: string;
    type: string;
}

export type Group = {
    avatar: Avatar;
    description: string;
    groups_members: GroupMembers[];
    id: string;
    invite_code: string;
    name: string;
} | null