import AuthorInfo from "./AuthorInfo";
import CommentActions from "./CommentActions";
import { formatDate } from "../utils/format";

export default function CommentItem({ comment, onEdit, onDelete }) {
  return (
    <div className="comment-item">
      <div className="comment-header">
        <AuthorInfo
          nickname={comment.writerNickname}
          date={formatDate(comment.createdAt)}
        />
        {comment.isMine && (
          <CommentActions onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
      <p className="comment-content">{comment.content}</p>
    </div>
  );
}
