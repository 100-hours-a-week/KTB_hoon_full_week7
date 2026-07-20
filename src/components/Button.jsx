export default function Button({ label, variant = "login", className = "", onClick, disabled = false }) {
    const baseClass = variant === "login" ? "login-btn" : "register-btn";
    return (
        <button
            className={`${baseClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}