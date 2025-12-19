// Auth
export type ErrorCode =
    | "missingField"
    | "invalidFormat"
    | "emailDoesNotExist"
    | "weakPassword"
    | "maxCharacterLimit"
    | "minCharacterLimit"
    | "";

// MainPage
export type Profile = {
    email: string | undefined;
    id?: string;
    username?: string;
    avatar_url?: string;
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
export type Member = {
    username: string;
    avatar_url: string;
}

export type GroupDetails = {
    avatar: Avatar;
    description: string;
    id: string;
    name: string;
} | null;

export type SelectedMenu = "games" | "members" | "settings";

// Games
export type GameResult = {
    id: number;
    imageUrl: string;
    name: string;
};

export type GameCapsuleData = {
    id: number;
    imageUrl: string;
    is_liked: boolean;
    likes_count: number;
    name: string;
};
