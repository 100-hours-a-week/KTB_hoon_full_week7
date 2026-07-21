import AuthorInfo from "./AuthorInfo";
import CommentActions from "./CommentActions";
import { formatDate } from "../utils/format";

export default function CommentItem({
  comment,
  isEditing,
  editValue,
  onStartEdit,
  onDelete,
  onEditChange,
  onEditSubmit,
  onEditCancel,
}) {
  return (
    <div className="comment-item">
      <div className="comment-header">
        <AuthorInfo
          nickname={comment.writerNickname}
          date={formatDate(comment.createdAt)}
        />
        {comment.isMine && !isEditing && (
          <CommentActions onEdit={onStartEdit} onDelete={onDelete} />
        )}
      </div>

      {isEditing ? (
        <div className="comment-edit">
          <textarea
            className="comment-edit-textarea"
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
          />
          <div className="comment-edit-actions">
            <button className="btn-comment-action" onClick={onEditCancel}>
              취소
            </button>
            <button
              className="btn-comment-action"
              onClick={onEditSubmit}
              disabled={!editValue.trim()}
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}
    </div>
  );
}
