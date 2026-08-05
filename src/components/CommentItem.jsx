import AuthorInfo from "./AuthorInfo";
import KebabMenu from "./KebabMenu";
import { formatDate } from "../utils/format";

export default function CommentItem({
  comment,
  isEditing,
  editValue,
  onStartEdit,
  onDelete,
  onReport,
  onEditChange,
  onEditSubmit,
  onEditCancel,
}) {
  const menuItems = comment.isMine
    ? [
        { label: "수정", onClick: onStartEdit },
        { label: "삭제", onClick: onDelete, danger: true },
      ]
    : [{ label: "신고", onClick: onReport, danger: true }];

  return (
    <div className="comment-item">
      <div className="comment-header">
        <AuthorInfo
          nickname={comment.writerNickname}
          date={formatDate(comment.createdAt)}
        />
        {!isEditing && <KebabMenu items={menuItems} ariaLabel="댓글 메뉴" />}
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
