import AuthorInfo from "./AuthorInfo";
import KebabMenu from "./KebabMenu";

// 제목 + 우측 상단 케밥 메뉴(내 글: 수정/삭제, 남의 글: 신고) + 작성자(+날짜)
export default function PostHeader({
  title,
  writerNickname,
  date,
  isMine,
  onEdit,
  onDelete,
  onReport,
}) {
  const menuItems = isMine
    ? [
        { label: "수정", onClick: onEdit },
        { label: "삭제", onClick: onDelete, danger: true },
      ]
    : [{ label: "신고", onClick: onReport, danger: true }];

  return (
    <div className="post-header">
      <div className="post-header-top">
        <p className="post-title">{title}</p>
        <KebabMenu items={menuItems} ariaLabel="모집글 메뉴" />
      </div>
      <div className="post-info-row">
        <AuthorInfo nickname={writerNickname} date={date} />
      </div>
    </div>
  );
}
