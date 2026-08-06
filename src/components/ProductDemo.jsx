import { HeartIcon, CommentIcon, EyeIcon } from "./icons";

// 홈 히어로용 제품 데모. 순수 CSS 애니메이션으로 "좋아요 누르는" 장면을 반복 재생한다.
export default function ProductDemo() {
  return (
    <div className="demo" aria-hidden="true">
      <div className="demo-window">
        <div className="demo-bar">
          <span className="demo-dot"></span>
          <span className="demo-dot"></span>
          <span className="demo-dot"></span>
          <span className="demo-title">Let&apos;s Meet</span>
        </div>

        <div className="demo-screen">
          <div className="demo-head">
            <span className="demo-eyebrow">RECRUIT BOARD</span>
            <span className="demo-h">최신 모집글</span>
          </div>

          <div className="demo-cards">
            <article className="demo-card">
              <p className="demo-card-title">React 프로젝트 팀원 구해요 🚀</p>
              <div className="demo-card-meta">
                <span className="demo-chip demo-like">
                  <HeartIcon className="chip-icon demo-heart" />
                  <b>13</b>
                  <span className="demo-plus">+1</span>
                  <span className="demo-ripple"></span>
                </span>
                <span className="demo-chip">
                  <CommentIcon className="chip-icon" /> 4
                </span>
                <span className="demo-chip">
                  <EyeIcon className="chip-icon" /> 92
                </span>
              </div>
            </article>

            <article className="demo-card">
              <p className="demo-card-title">알고리즘 스터디 모집합니다</p>
              <div className="demo-card-meta">
                <span className="demo-chip">
                  <HeartIcon className="chip-icon" /> 8
                </span>
                <span className="demo-chip">
                  <CommentIcon className="chip-icon" /> 2
                </span>
                <span className="demo-chip">
                  <EyeIcon className="chip-icon" /> 61
                </span>
              </div>
            </article>

            <article className="demo-card">
              <p className="demo-card-title">주말 해커톤 같이 나가실 분!</p>
              <div className="demo-card-meta">
                <span className="demo-chip">
                  <HeartIcon className="chip-icon" /> 21
                </span>
                <span className="demo-chip">
                  <CommentIcon className="chip-icon" /> 6
                </span>
                <span className="demo-chip">
                  <EyeIcon className="chip-icon" /> 140
                </span>
              </div>
            </article>
          </div>
        </div>

        <div className="demo-cursor">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M5 3l14 7-6 2-2 6-6-15z"
              fill="#1c1a15"
              stroke="#fff"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
