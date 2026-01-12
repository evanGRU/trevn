import styles from './likeCounterIcon.module.scss';

interface LikeCounterIconProps {
    likes: number;
    totalMembers: number;
}

export default function LikeCounterIcon({ likes, totalMembers }: LikeCounterIconProps) {
    const ratio = totalMembers > 0 ? (likes / totalMembers) * 100 : 0;
    const percentage = Math.min(ratio, 100);

    return (
        <div className={styles.likeIconBorder}>
            <div className={styles.likeIconContainer}>
                <div
                    className={styles.likeIconFill}
                    style={{ height: `${percentage}%` }}
                />
            </div>
        </div>
    );
}