import styles from "./defaultField.module.scss";

interface DefaultFieldProps {
    type: string;
    label: string;
    value: string;
    placeholder?: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
    isRequired?: boolean;
    errorMessage?: string;
}

export default function DefaultField({type, label, value, placeholder, handleChange, isRequired, errorMessage}: DefaultFieldProps) {
    return (
        <div className={styles.defaultField}>
            <label htmlFor={type}>{label} {isRequired && <span>*</span>}</label>
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
            />
            {errorMessage && (
                <p className={styles.errorMessage}>{errorMessage}</p>
            )}
        </div>
    )
}