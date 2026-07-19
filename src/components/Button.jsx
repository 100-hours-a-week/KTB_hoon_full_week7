export default function Button({ label, variant = "login", className = "", onClick }) {
    const baseClass = variant === "login" ? "login-btn" : "register-btn";
    return (
        <button type={variant === "login" ? "submit" : "button"} className={`${baseClass} ${className}`} onClick={onClick}>
            {label}
        </button>
    );
}