import HelperText from "./HelperText";

// 내용은 여러 줄이라 textarea 사용해야 한다고 함
export default function ContentField({ value, error, onChange }) {
  return (
    <div className="form-group">
      <label>내용*</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="모집 분야, 인원, 기간 등 모집 내용을 자세히 적어주세요."
      />
      <HelperText message={error} />
    </div>
  );
}
