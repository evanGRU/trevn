import styles from "./invitationField.module.scss";
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useToasts} from "@/utils/useToasts";

interface InvitationFieldProps {
    text: string | undefined;
    type: string;
}

export default function InvitationField({text, type}: InvitationFieldProps) {
    const [copied, setCopied] = useState(false);
    const {errorToast, successToast} = useToasts();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCopy = async (text: string | undefined) => {
        if (!text) return;
        if (timeoutRef.current) return;
        try {
            await navigator.clipboard.writeText(text);

            setCopied(true);
            successToast(type === "code" ? "Code copié !" : "Lien copié !");

            timeoutRef.current = setTimeout(() => {
                setCopied(false);
                timeoutRef.current = null;
            }, 1500);
        } catch {
            errorToast("Impossible de copier");
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <button
            className={`${styles.buttonContainer} ${copied ? styles.copied : ""}`}
            type={"button"}
            onClick={() => handleCopy(text)}
        >
            <p className={styles.text}>{text}</p>

            <div className={styles.copyButton}>
                <Image
                    src={`/icons/${copied ? "check" : "copy"}.svg`}
                    alt="Copy icon"
                    width={24}
                    height={24}
                />
            </div>
        </button>
    )
}