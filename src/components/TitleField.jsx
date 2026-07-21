import Input from "./Input";
import HelperText from "./HelperText";

export default function TitleField({ value, error, onChange }) {
  return (
    <div className="form-group">
      <label>제목*</label>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="제목을 입력해주세요. (최대 26글자)"
        maxLength={26}
      />
      <HelperText message={error} />
    </div>
  );
}
