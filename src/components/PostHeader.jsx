import AuthorInfo from "./AuthorInfo";
import KebabMenu from "./KebabMenu";
import PostQuickStats from "./PostQuickStats";

// 제목 + 우측 상단 케밥 메뉴(내 글: 수정/삭제, 남의 글: 신고) + 작성자(+날짜) + 소형 통계(좋아요/조회수/댓글)
export default function PostHeader({
  title,
  writerNickname,
  date,
  isMine,
  isClosed,
  onEdit,
  onDelete,
  onReport,
  onCloseRecruit,
  likeCount,
  isLiked,
  isLikeLoading,
  onLikeClick,
  viewCount,
  commentCount,
}) {
  const menuItems = isMine
    ? [
        ...(isClosed
          ? []
          : [{ label: "모집 마감", onClick: onCloseRecruit }]),
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
        <PostQuickStats
          likeCount={likeCount}
          isLiked={isLiked}
          isLikeLoading={isLikeLoading}
          onLikeClick={onLikeClick}
          viewCount={viewCount}
          commentCount={commentCount}
        />
      </div>
    </div>
  );
}
