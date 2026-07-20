import HelperText from "./HelperText";
import Input from "./Input";

export default function EmailField({ value, error, onChange }) {
    return (
        <div className="field">
            <label>이메일</label>
            <Input type="email" value={value} onChange={onChange} />
            <HelperText message={error} />
        </div>
    );
}