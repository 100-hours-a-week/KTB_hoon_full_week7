import HelperText from "./HelperText";

export default function PasswordField({ value, error, onChange }) {
    return (
        <div className="field">
            <label>비밀번호</label>
            <Input type="password" value={value} onChange={(e) => onChange(e.target.value)} />
            <HelperText message={error} />
        </div>
    );
}