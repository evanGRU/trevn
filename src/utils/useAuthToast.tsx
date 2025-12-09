"use client";

import toast from "react-hot-toast";
import CustomToast from "@/components/general/customToast/customToast";

export function useAuthToast() {
    const successToast = (successMessage: string) => {
        toast.custom(<CustomToast title={successMessage} type={"success"}/>);
    };

    const errorToast = (errorMessage: string) => {
        toast.custom(<CustomToast title={errorMessage} type={"error"} />);
    };

    return {
        successToast,
        errorToast
    };
}