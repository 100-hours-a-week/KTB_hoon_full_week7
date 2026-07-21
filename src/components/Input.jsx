export default function Input({ type = "text", value, onChange, placeholder, maxLength }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}