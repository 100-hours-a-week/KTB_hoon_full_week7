import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
  editingCommentId,
  editValue,
  onStartEdit,
  onDeleteComment,
  onEditChange,
  onEditSubmit,
  onEditCancel,
}) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          isEditing={comment.commentId === editingCommentId}
          editValue={editValue}
          onStartEdit={() => onStartEdit(comment)}
          onDelete={() => onDeleteComment(comment.commentId)}
          onEditChange={onEditChange}
          onEditSubmit={onEditSubmit}
          onEditCancel={onEditCancel}
        />
      ))}
    </div>
  );
}
