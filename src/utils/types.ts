// Auth

export type AuthModes = "login" | "signup";

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
export type ProfileDefault = {
    id?: string;
    username?: string;
} | null;

export type Profile = {
    email?: string | undefined;
    id?: string;
    new_email?: string;
    username?: string;
    avatar: Avatar;
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

export type UpdateUserPayload = {
    username?: string;
    email?: string;
    password?: string;
};

// GroupDetailsPage
export type Member = {
    id: string;
    username: string;
    avatar: Avatar;
    roles: "owner" | "";
}

export type GroupDetails = {
    avatar: Avatar;
    created_by: string
    description: string;
    id: string;
    invite_code: string;
    members: Member[];
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
