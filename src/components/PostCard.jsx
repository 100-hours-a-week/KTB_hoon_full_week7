import AuthorInfo from "./AuthorInfo";
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
          <span>좋아요 {formatCount(post.likeCount)}</span>
          <span>댓글 {formatCount(post.commentCount)}</span>
          <span>조회수 {formatCount(post.viewCount)}</span>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>

      <AuthorInfo nickname={post.writerNickname} />
    </div>
  );
}
