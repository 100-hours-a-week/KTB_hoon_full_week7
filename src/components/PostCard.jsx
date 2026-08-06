import AuthorInfo from "./AuthorInfo";
import { HeartIcon, CommentIcon, EyeIcon } from "./icons";
import { formatCount, formatDate } from "../utils/format";

export default function PostCard({ post, onClick }) {
  return (
    <div className="post-card" onClick={onClick}>
      <p className="post-title">
        {post.isBlind ? "숨김 처리된 모집글" : post.title}
      </p>

      {/* 좋아요/댓글/조회수 + 날짜 — PostCard 안에 인라인 */}
      <div className="post-meta">
        <div className="post-stats">
          <span className="stat-chip">
            <HeartIcon className="chip-icon" /> {formatCount(post.likeCount)}
          </span>
          <span className="stat-chip">
            <CommentIcon className="chip-icon" /> {formatCount(post.commentCount)}
          </span>
          <span className="stat-chip">
            <EyeIcon className="chip-icon" /> {formatCount(post.viewCount)}
          </span>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>

      <AuthorInfo nickname={post.writerNickname} />
    </div>
  );
}
