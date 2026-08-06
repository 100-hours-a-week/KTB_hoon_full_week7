import { HeartIcon } from "./icons";

// 좋아요 박스. isLiked 여부는 .liked 클래스로 토글한다(인라인 스타일 조작 X).
export default function LikeButton({ likeCount, isLiked, disabled, onClick }) {
  function handleClick() {
    if (disabled) return; // 로딩 중이면 무시(연타 방지)
    onClick();
  }

  return (
    <button
      type="button"
      className={`stat-box like-btn${isLiked ? " liked" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isLiked}
    >
      <HeartIcon className="stat-icon heart-icon" filled={isLiked} />
      <span className="stat-number">{likeCount}</span>
      <span className="stat-label">좋아요</span>
    </button>
  );
}
