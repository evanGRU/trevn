// MainPage
export type Profile = {
    id: string;
    username: string;
    avatar_url: string | null;
} | null;

export type Avatar = {
    id: string;
    name: string;
    type: string;
}

export type Group = {
    avatar: Avatar;
    id: string;
    name: string;
} | null;


// GroupDetailsPage
export type GroupMembers = {
    user_id: string;
}

export type GroupDetails = {
    avatar: Avatar;
    description: string;
    id: string;
    name: string;
} | null;

export type SelectedMenu = "games" | "members" | "settings";

export type GameResult = {
    id: number;
    imageUrl: string;
    name: string;
};
