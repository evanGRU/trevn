import styles from "./searchField.module.scss";
import Image from "next/image";


interface SearchFieldProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchField({search, setSearch}: SearchFieldProps) {
    return (
        <div className={styles.searchField}>
            <input
                type="text"
                placeholder={"RECHERCHER DANS LA LISTE"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className={styles.iconButton}>
                {search ? (
                    <button onClick={() => setSearch("")}>
                        <Image
                            src={"/icons/close.svg"}
                            alt={"Close icon"}
                            width={16}
                            height={16}
                        />
                    </button>
                ) : (
                    <Image
                        src={"/icons/search.svg"}
                        alt={"Search icon"}
                        width={16}
                        height={16}
                    />
                )}
            </div>
        </div>
    )
}