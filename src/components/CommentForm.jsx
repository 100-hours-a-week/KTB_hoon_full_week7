// 댓글 입력창 + 등록/수정 버튼 (순수 View).
// isEditing 여부에 따라 버튼 라벨만 바뀌고, 실제 POST/PATCH 분기는 onSubmit(상위)이 담당.
export default function CommentForm({
  value,
  onChange,
  onSubmit,
  isEditing,
  disabled,
}) {
  const label = isEditing ? "댓글 수정" : "댓글 등록";
  const isActive = value.trim().length > 0;

  return (
    <div className="comment-input-section">
      <textarea
        className="comment-textarea"
        placeholder="관심 있다면 댓글을 남겨주세요!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="comment-input-footer">
        <button
          className={`btn-comment-submit${isActive ? " active" : ""}`}
          onClick={onSubmit}
          disabled={disabled || !isActive}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
