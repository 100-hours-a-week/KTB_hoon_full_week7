import { useRef } from "react";

// 파일 선택 버튼 + 선택된 파일명 표시 (순수 View).
// 실제 업로드는 없고, 선택 시 파일명만 상위로 넘긴다.
export default function ImageField({ fileName, onFileSelect }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  }

  return (
    <div className="image-group">
      <label>이미지</label>
      <div className="image-input-wrapper">
        <button
          type="button"
          className="btn-file"
          onClick={() => inputRef.current.click()}
        >
          파일 선택
        </button>
        <span className="file-name">{fileName}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
