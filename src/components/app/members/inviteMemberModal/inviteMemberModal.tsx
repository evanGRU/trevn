import styles from "./inviteMemberModal.module.scss";
import React from "react";
import ModalWrapper from "@/components/general/modalWrapper/modalWrapper";
import InvitationField from "@/components/app/members/inviteMemberModal/invitationField/invitationField";

interface InviteMemberModalProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    invitationCode: string | undefined;
}

export default function InviteMemberModal({setModal, invitationCode}: InviteMemberModalProps) {
    const invitationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/${invitationCode}`;

    return (
        <ModalWrapper
            setModal={setModal}
            closeIconTopPosition={"170px"}
        >
            <div className={styles.modalHeader}>
                <h1>Inviter des amis</h1>
                <p>Invite tes amis à rejoindre ton groupe en leur envoyant ce code à rentrer dans l’application.</p>
            </div>

            <div className={styles.invitationCodeContainer}>
                <h3>Code d&apos;invitation : </h3>
                <InvitationField text={invitationCode} type={'code'}/>
            </div>

            <div className={styles.invitationLinkContainer}>
                <p>Ou envoie leur directement un lien d’invitation</p>
                <InvitationField text={invitationLink} type={'link'}/>
            </div>
        </ModalWrapper>
    )
}