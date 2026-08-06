import AuthorInfo from "./AuthorInfo";
import {
  HeartIcon,
  CommentIcon,
  EyeIcon,
  PinIcon,
  GlobeIcon,
  UsersIcon,
} from "./icons";
import { formatCount, formatDate } from "../utils/format";
import {
  categoryEmoji,
  categoryLabel,
  formatAddress,
} from "../constants/recruit";

export default function PostCard({ post, onClick }) {
  const isOnline = post.meetingType === "ONLINE";
  const isClosed = post.recruitStatus === "CLOSED";
  const location = isOnline
    ? post.placeName
    : formatAddress(post.address, post.placeName);

  return (
    <div className={`post-card${isClosed ? " closed" : ""}`} onClick={onClick}>
      <div className="card-top">
        <span className="cat-badge">
          <span>{categoryEmoji(post.category)}</span>
          {categoryLabel(post.category)}
        </span>
        <span className={`status-pill ${isClosed ? "closed" : "recruiting"}`}>
          {isClosed ? "모집완료" : "모집중"}
        </span>
      </div>

      <p className="post-title">
        {post.isBlind ? "숨김 처리된 모집글" : post.title}
      </p>

      <div className="card-recruit">
        <span>
          {isOnline ? (
            <GlobeIcon className="recruit-ic" />
          ) : (
            <PinIcon className="recruit-ic" />
          )}
          {location || (isOnline ? "온라인" : "오프라인")}
        </span>
        {post.capacity != null && (
          <span>
            <UsersIcon className="recruit-ic" />
            {post.capacity}명
          </span>
        )}
      </div>

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
