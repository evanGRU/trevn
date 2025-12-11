import styles from "./searchField.module.scss";
import Image from "next/image";


interface SearchFieldProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SearchField({onChange}: SearchFieldProps) {
    return (
        <div className={styles.searchField}>
            <input
                type="text"
                placeholder={"RECHERCHER DANS LA LISTE"}
                onChange={onChange}
            />
            <div
                className={styles.iconContainer}
                onClick={() => alert('search')}
            >
                <Image
                    src={'/icons/search.svg'}
                    alt={"Search icon"}
                    width={16}
                    height={16}
                />
            </div>
        </div>
    )
}