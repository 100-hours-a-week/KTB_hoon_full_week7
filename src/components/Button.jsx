export default function Button({ label, variant = "primary", className = "", onClick, disabled = false }) {
    const baseClass = variant === "primary" ? "btn-primary" : "btn-link";
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