import HelperText from "./HelperText";
import Input from "./Input";

export default function PasswordConfirmField({ value, error, onChange, placeholder = "비밀번호를 한번 더 입력하세요" }) {
  return (
    <div className="field">
      <label>비밀번호 확인</label>
      <Input
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <HelperText message={error} />
    </div>
  );
}