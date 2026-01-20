import {UserErrorMessages, UserProps} from "@/utils/types";

export const userPrompts: Record<
    UserProps,
    {
        label: string;
        placeholder: string;
        errors: UserErrorMessages;
        editTitle: string;
    }
> = {
    username: {
        label: "Nom d'utilisateur",
        placeholder: "Entre ton nom d'utilisateur",
        errors: {
            missingField: "Nom d'utilisateur requis.",
            maxCharacterLimit: "Le nom d'utilisateur ne peux pas dépasser 20 caractères.",
            minCharacterLimit: "Le nom d'utilisateur requiert au moins 3 caractères."
        },
        editTitle: "Modifier le nom d'utilisateur"
    },
    email: {
        label: "Email",
        placeholder: "Entre ton email",
        errors: {
            missingField: "Email requis.",
            invalidFormat: "Format d'email invalide.",
            emailDoesNotExist: "Adresse e-mail inexistante."
        },
        editTitle: "Modifier l'adresse e-mail"
    },
    password: {
        label: "Mot de passe",
        placeholder: "Entre ton mot de passe",
        errors: {
            missingField: "Mot de passe requis.",
            weakPassword: "Le mot de passe doit contenir au moins 6 caractères.",
            samePassword: "Tu ne peux pas mettre le même mot de passe que tu avais.",
            notTheSame: "Les deux mots de passe ne correspondent pas."
        },
        editTitle: "Modifier le mot de passe"
    },
};


export const groupRulesPrompts: Record<
    string,
    {
        title: string;
        subruleTitle?: string;
    }
> = {
    add_games: {
        title: "Autoriser les membres à ajouter des jeux au groupe.",
    },
    delete_games: {
        title: "Autoriser les membres à supprimer des jeux du groupe.",
        subruleTitle: "Limiter la suppression au propriétaire et aux modérateurs."
    },
    like_games: {
        title: "Activer les likes de groupe.",
    }
}

export const resetPasswordPrompts: Record<
    string,
    {
        label: string;
        placeholder: string;
        errors: UserErrorMessages;
        editTitle: string;
    }
> = {
    newPassword: {
        label: "Nouveau mot de passe",
        placeholder: "Entre ton nouveau mot de passe",
        errors: {
            missingField: "Nouveau mot de passe requis.",
            maxCharacterLimit: "Le nom d'utilisateur ne peux pas dépasser 20 caractères.",
            minCharacterLimit: "Le nom d'utilisateur requiert au moins 3 caractères."
        },
        editTitle: "Modifier le nom d'utilisateur"
    },
    newPasswordConfirm: {
        label: "Confirmation du nouveau mot de passe",
        placeholder: "Confirme ton nouveau mot de passe",
        errors: {
            missingField: "Confirmation du nouveau mot de passe requis.",
            weakPassword: "Le mot de passe doit contenir au moins 6 caractères.",
            samePassword: "Tu ne peux pas mettre le même mot de passe que tu avais.",
            notTheSame: "Les deux mots de passe ne correspondent pas."
        },
        editTitle: "Modifier l'adresse e-mail"
    },
};