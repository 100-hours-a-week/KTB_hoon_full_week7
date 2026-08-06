import {
  categoryEmoji,
  categoryLabel,
  meetingLabel,
  formatAddress,
} from "../constants/recruit";

// 상세 페이지 모집 정보 패널
export default function PostRecruitInfo({ post }) {
  const isOnline = post.meetingType === "ONLINE";
  const isClosed = post.recruitStatus === "CLOSED";
  const location = isOnline
    ? post.placeName
    : formatAddress(post.address, post.placeName);

  return (
    <div className="recruit-panel">
      <div className="recruit-tags">
        <span className="cat-badge">
          <span>{categoryEmoji(post.category)}</span>
          {categoryLabel(post.category)}
        </span>
        <span className={`status-pill ${isClosed ? "closed" : "recruiting"}`}>
          {isClosed ? "모집완료" : "모집중"}
        </span>
      </div>

      <dl className="recruit-rows">
        <div className="recruit-row">
          <dt>모임 방식</dt>
          <dd>{meetingLabel(post.meetingType)}</dd>
        </div>
        <div className="recruit-row">
          <dt>{isOnline ? "장소" : "위치"}</dt>
          <dd>{location || "-"}</dd>
        </div>
        {post.capacity != null && (
          <div className="recruit-row">
            <dt>모집 인원</dt>
            <dd>{post.capacity}명</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
