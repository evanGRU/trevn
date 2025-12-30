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