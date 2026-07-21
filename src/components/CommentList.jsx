import CommentItem from "./CommentItem";

// comments 배열을 순회하며 CommentItem 렌더 (렌더 책임만)
export default function CommentList({ comments, onEditComment, onDeleteComment }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onEdit={() => onEditComment(comment)}
          onDelete={() => onDeleteComment(comment.commentId)}
        />
      ))}
    </div>
  );
}
