import HelperText from "./HelperText";
import Input from "./Input";

export default function NicknameField({ value, error, onChange, placeholder = "닉네임을 입력하세요" }) {
    return (
        <div className="field">
            <label>닉네임</label>
            <Input type="text" value={value} onChange={onChange} placeholder={placeholder} />
            <HelperText message={error} />
        </div>
    );
}