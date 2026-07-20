import HelperText from "./HelperText";
import Input from "./Input";

export default function EmailField({ value, error, onChange, placeholder = "이메일을 입력하세요" }) {
    return (
        <div className="field">
            <label>이메일</label>
            <Input type="email" value={value} onChange={onChange} placeholder={placeholder} />
            <HelperText message={error} />
        </div>
    );
}