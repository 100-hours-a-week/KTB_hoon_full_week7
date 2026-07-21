import AuthorInfo from "./AuthorInfo";
import PostActions from "./PostActions";

// 제목 + 작성자(+날짜) + (내 글이면) 수정/삭제
export default function PostHeader({
  title,
  writerNickname,
  date,
  isMine,
  onEdit,
  onDelete,
}) {
  return (
    <div className="post-header">
      <p className="post-title">{title}</p>
      <div className="post-info-row">
        <AuthorInfo nickname={writerNickname} date={date} />
        {isMine && <PostActions onEdit={onEdit} onDelete={onDelete} />}
      </div>
    </div>
  );
}
