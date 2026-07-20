import HelperText from "./HelperText";
import Input from "./Input";

export default function PasswordField({ value, error, onChange }) {
    return (
        <div className="field">
            <label>비밀번호</label>
            <Input type="password" value={value} onChange={onChange} />
            <HelperText message={error} />
        </div>
    );
}