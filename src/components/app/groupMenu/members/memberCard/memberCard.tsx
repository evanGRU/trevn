import styles from "./memberCard.module.scss";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {getPublicAvatarUrl} from "@/utils/globalFunctions";
import {DbImage} from "@/components/general/dbImage/dbImage";
import {Member, ProfileDefault} from "@/utils/types";
import {AnimatePresence} from "framer-motion";
import {OptionsButton} from "@/components/general/options/optionsButton/optionsButton";
import {OptionsModalWrapper} from "@/components/general/options/optionsModalWrapper/optionsModalWrapper";

interface MemberCardProps {
    member: Member;
    userHaveRights: boolean;
    handleKick: (user: Member) => void;
    profile: ProfileDefault;
}

export const MemberCard = ({member, userHaveRights, handleKick, profile}: MemberCardProps) => {
    const [areOptionsOpen, setAreOptionsOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement | null>(null);

    const allOptions = [
        {
            name: "kick-option",
            text: `Exclure ${member.username}`,
            isWarningButton: true,
            canShow: () => profile?.id !== member.id && userHaveRights,
            handleClick: () => handleKick(member),
        },
    ];

    const optionsProps = allOptions.filter(opt => opt.canShow());

    useEffect(() => {
        if (areOptionsOpen) {
            function handleClickOutside(event: MouseEvent) {
                if (
                    areOptionsOpen &&
                    optionsRef.current &&
                    !optionsRef.current.contains(event.target as Node)
                ) {
                    setAreOptionsOpen(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }

    }, [areOptionsOpen]);

    return (
        <div className={`${styles.memberCard} ${profile?.id === member.id ? styles.ownMemberCard : ""}`}>
            <div className={styles.userDetailsContainer}>
                <DbImage
                    src={getPublicAvatarUrl(member.avatar.type, member.avatar.name)}
                    alt={"User avatar"}
                    width={48}
                    height={48}
                    className={styles.pp}
                />

                <div className={styles.textContainer}>
                    <p>{member.username}</p>
                    {member.role === "owner" && (
                        <Image
                            src={"/icons/owner.svg"}
                            alt={"Owner Icon"}
                            height={16}
                            width={16}
                        />
                    )}
                </div>
            </div>

            {optionsProps.length >= 1 && (
                <div className={styles.optionsGlobalContainer} ref={optionsRef}>
                    <div className={styles.optionsButtonContainer}>
                        <div className={`${styles.optionsButton} ${areOptionsOpen ? styles.buttonOpen : ""}`} onClick={() => setAreOptionsOpen(prev => !prev)}>
                            <Image
                                src={`/icons/${areOptionsOpen ? "close" : "moreVertical"}.svg`}
                                alt={"More Icon"}
                                height={areOptionsOpen ? 18 : 24}
                                width={areOptionsOpen ? 18 : 24}
                            />
                        </div>
                    </div>
                    <AnimatePresence>
                        {areOptionsOpen && (
                            <OptionsModalWrapper>
                                {optionsProps.map((option) => (
                                    <OptionsButton key={option.name} isWarningButton={option.isWarningButton} handleClick={option.handleClick}>
                                        {option.text}
                                    </OptionsButton>
                                ))}
                            </OptionsModalWrapper>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
};

