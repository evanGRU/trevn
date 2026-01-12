"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {fetcher} from "@/utils/globalFunctions";
import {useToasts} from "@/utils/helpers/useToasts";

type UseSWRWithErrorOptions = {
    errorMessage: string;
    redirectTo?: string;
};

export function useSWRWithError<T>(
    key: string,
    options: UseSWRWithErrorOptions
) {
    const router = useRouter();
    const { errorToast } = useToasts();

    const swr = useSWR<T>(key, fetcher);

    useEffect(() => {
        if (!swr.error) return;

        errorToast(options.errorMessage);

        if (options.redirectTo) {
            router.push(options.redirectTo);
        }
    }, [swr.error]);

    return swr;
}
