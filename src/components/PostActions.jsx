// 내 글일 때만 렌더되는 수정/삭제 버튼 묶음
export default function PostActions({ onEdit, onDelete }) {
  return (
    <div className="post-actions">
      <button className="btn-action" onClick={onEdit}>수정</button>
      <button className="btn-action" onClick={onDelete}>삭제</button>
    </div>
  );
}
