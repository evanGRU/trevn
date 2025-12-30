// Auth
export type UserErrorCode =
    | "missingField"
    | "invalidFormat"
    | "emailDoesNotExist"
    | "weakPassword"
    | "maxCharacterLimit"
    | "minCharacterLimit"
    | "notTheSame"
    | "samePassword"
    | "";

export type UserErrorMessages = {
    missingField?: string;
    invalidFormat?: string;
    emailDoesNotExist?: string;
    weakPassword?: string;
    maxCharacterLimit?: string;
    minCharacterLimit?: string;
    notTheSame?: string;
    samePassword?: string;
};

// MainPage
export type Profile = {
    email?: string | undefined;
    id?: string;
    new_email?: string;
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

// UserSettings
export type UserProps = 'username' | 'email' | 'password';

export type SettingTab = {
    name: string;
    iconPath: string;
    id: string;
}

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
