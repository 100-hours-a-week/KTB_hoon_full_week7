import HelperText from "./HelperText";
import Input from "./Input";

export default function NicknameField({ value, error, onChange }) {
    return (
        <div className="field">
            <label>닉네임</label>
            <Input type="text" value={value} onChange={onChange} />
            <HelperText message={error} />
        </div>
    );
}