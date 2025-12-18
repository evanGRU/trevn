import styles from "./defaultField.module.scss";

interface DefaultFieldProps {
    type: string;
    label: string;
    value: string;
    placeholder?: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    isRequired?: boolean;
    errorMessage?: string;
    maxLength?: number;
}

export default function DefaultField({type, label, value, placeholder, handleChange, isRequired, errorMessage, maxLength}: DefaultFieldProps) {
    return (
        <div className={styles.defaultField}>
            <label htmlFor={type}>{label} {isRequired && <span>*</span>}</label>
            <div className={styles.fieldContainer}>
                <input
                    id={type}
                    value={value}
                    type={type}
                    placeholder={placeholder}
                    onChange={handleChange}
                    required={isRequired}
                    autoCorrect="off"
                    autoComplete={"off"}
                    className={`${errorMessage ? styles.requiredError : ""}`}
                    maxLength={maxLength}
                />
                {maxLength && (
                    <div className={styles.fieldInsideContainer}>
                        <p>{value.length}/{maxLength - 1}</p>
                    </div>
                )}
            </div>
            {errorMessage && (
                <p className={"errorMessage"}>{errorMessage}</p>
            )}
        </div>
    )
}