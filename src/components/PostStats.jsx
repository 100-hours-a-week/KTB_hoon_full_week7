import LikeButton from "./LikeButton";
import { EyeIcon, CommentIcon } from "./icons";

// 좋아요(클릭 가능) + 조회수 + 댓글 수 박스 3개
export default function PostStats({
  likeCount,
  isLiked,
  isLikeLoading,
  onLikeClick,
  viewCount,
  commentCount,
}) {
  return (
    <div className="detail-stats">
      <LikeButton
        likeCount={likeCount}
        isLiked={isLiked}
        disabled={isLikeLoading}
        onClick={onLikeClick}
      />
      <div className="stat-box">
        <EyeIcon className="stat-icon" />
        <span className="stat-number">{viewCount}</span>
        <span className="stat-label">조회수</span>
      </div>
      <div className="stat-box">
        <CommentIcon className="stat-icon" />
        <span className="stat-number">{commentCount}</span>
        <span className="stat-label">댓글</span>
      </div>
    </div>
  );
}
