import HelperText from "./HelperText";

export default function PasswordConfirmField({ value, error, onChange }) {
  return (
    <div className="field">
      <label>비밀번호 확인</label>
      <input
        type="password"
        placeholder="비밀번호 한번 더 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <HelperText message={error} />
    </div>
  );
}