import { HeartIcon, EyeIcon, CommentIcon } from "./icons";

// 상세 헤더 우측(날짜 옆)에 들어가는 소형 좋아요/조회수/댓글 수 표시.
// 좋아요는 하트 아이콘 클릭으로 바로 토글된다.
export default function PostQuickStats({
  likeCount,
  isLiked,
  isLikeLoading,
  onLikeClick,
  viewCount,
  commentCount,
}) {
  return (
    <div className="post-stats quick-stats">
      <button
        type="button"
        className={`stat-chip like-chip${isLiked ? " liked" : ""}`}
        onClick={onLikeClick}
        disabled={isLikeLoading}
        aria-pressed={isLiked}
        aria-label="좋아요"
      >
        <HeartIcon className="chip-icon heart-icon" filled={isLiked} />
        {likeCount}
      </button>
      <span className="stat-chip">
        <EyeIcon className="chip-icon" />
        {viewCount}
      </span>
      <span className="stat-chip">
        <CommentIcon className="chip-icon" />
        {commentCount}
      </span>
    </div>
  );
}
