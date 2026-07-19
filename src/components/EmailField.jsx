import HelperText from "./HelperText";

export default function EmailField({ value, error, onChange }) {
    return (
        <div className="field">
            <label>이메일</label>
            <Input type="email" value={value} onChange={(e) => onChange(e.target.value)} />
            <HelperText message={error} />
        </div>
    );
}