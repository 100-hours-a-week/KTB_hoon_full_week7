// 내 댓글일 때만 렌더되는 수정/삭제 버튼 묶음
export default function CommentActions({ onEdit, onDelete }) {
  return (
    <div className="comment-actions">
      <button className="btn-comment-action" onClick={onEdit}>수정</button>
      <button className="btn-comment-action" onClick={onDelete}>삭제</button>
    </div>
  );
}
