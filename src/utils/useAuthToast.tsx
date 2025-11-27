"use client";

import toast from "react-hot-toast";
import CustomToast from "@/components/app/customToast/customToast";

export function useAuthToast() {
    const loginToast = () => {
        toast.custom(<CustomToast title={"Connexion réussie"} type={"success"}/>);
    };

    const signupToast = () => {
        toast.custom(<CustomToast title="Ton compte est prêt ! Vérifie ta boîte mail pour finaliser la confirmation." type={"success"}/>);
    };

    const errorToast = (errorMessage: string) => {
        console.error(errorMessage);
        toast.custom(<CustomToast title="Une erreur s'est produite" type={"error"} />);
    };

    return {
        signupToast,
        errorToast
    };
}