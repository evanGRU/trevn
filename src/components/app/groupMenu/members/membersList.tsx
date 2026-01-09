import styles from "./membersList.module.scss";
import GlassButton from "@/components/general/glassButton/glassButton";
import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {GroupDetails, Member, ProfileDefault} from "@/utils/types";
import {MemberCard} from "@/components/app/groupMenu/members/memberCard/memberCard";
import {useToasts} from "@/utils/helpers/useToasts";
import {KeyedMutator} from "swr";
import InviteMemberModal from "@/components/app/groupMenu/members/inviteMemberModal/inviteMemberModal";
import {AnimatePresence} from "framer-motion";
import MenuHeader from "@/components/app/groupMenu/menuHeader/menuHeader";

export type GamesListHandle = {
    enableScroll: () => void;
    disableScroll: () => void;
    isAtTop: () => boolean;
};

interface MembersListProps {
    members: Member[];
    profile: ProfileDefault;
    refreshMembers: KeyedMutator<Member[]>;
    group: GroupDetails;
    userHaveRights: boolean;
}

export const MembersList = forwardRef<GamesListHandle, MembersListProps>(({
                                                                              members,
                                                                              profile,
                                                                              refreshMembers,
                                                                              group,
                                                                              userHaveRights
                                                                          }, ref) => {
    const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
    const membersRef = useRef<HTMLDivElement>(null);
    const {successToast, errorToast} = useToasts();

    useImperativeHandle(ref, () => ({
        enableScroll() {
            if (membersRef.current) {
                membersRef.current.style.overflowY = "scroll";
            }
        },
        disableScroll() {
            if (membersRef.current) {
                membersRef.current.style.overflowY = "hidden";
                membersRef.current.scrollTop = 0;
            }
        },
        isAtTop() {
            return membersRef.current?.scrollTop === 0;
        },
    }));

    const handleKick = async (user: Member) => {
        try {
            const res = await fetch('/api/groups/members/kick', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userIdToKick: user.id,
                    groupId: group?.id
                }),
            })

            if (!res.ok) {
                errorToast("Erreur lors d'exclusion de l'utilisateur.");
                return;
            }

            successToast(`${user.username} vient d'être exclu de ton groupe.`)
            await refreshMembers();
        } catch (err) {
            console.error(err);
            errorToast('Une erreur est survenue');
        }
    }

    return (
        <>
            <MenuHeader title={`Liste des membres - ${members.length}`}>
                {(userHaveRights || group?.access_mode !== "closed") && (
                    <GlassButton type={"button"} handleClick={() => setIsInviteMemberModalOpen(true)}>
                        Inviter un ami
                    </GlassButton>
                )}
            </MenuHeader>

            <div ref={membersRef} className={styles.membersContainer}>
                {members.map((member) => (
                    <MemberCard
                        key={`member-card-${member.username}`}
                        member={member}
                        userHaveRights={userHaveRights}
                        handleKick={handleKick}
                        profile={profile}
                    ></MemberCard>
                ))}
            </div>

            <AnimatePresence>
                {isInviteMemberModalOpen && (
                    <InviteMemberModal
                        setModal={setIsInviteMemberModalOpen}
                        invitationCode={group?.invite_code}
                        groupIsClosed={group?.access_mode === "closed"}
                    />
                )}
            </AnimatePresence>
        </>
    )
});

MembersList.displayName = "MembersList";