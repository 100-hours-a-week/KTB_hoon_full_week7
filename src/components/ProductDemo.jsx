import { useEffect, useState } from "react";
import { HeartIcon, CommentIcon, EyeIcon, FilterIcon } from "./icons";

// 홈 히어로용 제품 데모. 여러 장면(목록→필터→상세)이 순서대로 재생되며
// 실제 서비스 흐름(좋아요, 카테고리 필터, 상세 진입 후 스크롤)을 순수 CSS 애니메이션으로 보여준다.
const SCENE_DURATIONS_MS = [4200, 4400, 5200];

function DemoCursor({ className }) {
  return (
    <div className={`demo-cursor ${className}`}>
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
  );
}

// 장면 1: 목록에서 좋아요 누르기
function SceneLike() {
  return (
    <div className="demo-scene">
      <div className="demo-head">
        <span className="demo-eyebrow">MEETUP PLATFORM</span>
        <span className="demo-h">지금 뜨는 모임</span>
      </div>

      <div className="demo-cards">
        <article className="demo-card">
          <p className="demo-card-title">주말 한강 러닝 크루 모집 🏃</p>
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
          <p className="demo-card-title">토익 스터디 같이 하실 분</p>
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
          <p className="demo-card-title">망원동 맛집 탐방 모임 🍜</p>
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

      <DemoCursor className="demo-cursor-like" />
    </div>
  );
}

// 장면 2: 카테고리 필터로 좁혀보기
function SceneFilter() {
  return (
    <div className="demo-scene">
      <div className="demo-head">
        <span className="demo-eyebrow">MEETUP PLATFORM</span>
        <span className="demo-h">카테고리로 찾기</span>
      </div>

      <div className="demo-filter-chips">
        <span className="demo-filter-chip">전체</span>
        <span className="demo-filter-chip demo-filter-target">
          <FilterIcon className="chip-icon" /> 운동/스포츠
        </span>
        <span className="demo-filter-chip">스터디</span>
        <span className="demo-filter-chip">맛집/모임</span>
      </div>

      <div className="demo-cards">
        <article className="demo-card demo-card-match">
          <p className="demo-card-title">주말 한강 러닝 크루 모집 🏃</p>
          <div className="demo-card-meta">
            <span className="demo-chip">
              <HeartIcon className="chip-icon" /> 13
            </span>
            <span className="demo-chip">
              <CommentIcon className="chip-icon" /> 4
            </span>
            <span className="demo-chip">
              <EyeIcon className="chip-icon" /> 92
            </span>
          </div>
        </article>

        <article className="demo-card demo-card-out">
          <p className="demo-card-title">토익 스터디 같이 하실 분</p>
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

        <article className="demo-card demo-card-out" style={{ animationDelay: "0.06s" }}>
          <p className="demo-card-title">망원동 맛집 탐방 모임 🍜</p>
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

      <DemoCursor className="demo-cursor-filter" />
    </div>
  );
}

// 장면 3: 게시글 상세 진입 후 스크롤
function SceneDetail() {
  return (
    <div className="demo-scene">
      <div className="demo-detail-head">
        <span className="demo-detail-back">‹</span>
        <span className="demo-detail-headtitle">모집글</span>
      </div>

      <div className="demo-detail-viewport">
        <div className="demo-detail-inner">
          <p className="demo-detail-title">주말 한강 러닝 크루 모집 🏃</p>

          <div className="demo-detail-tags">
            <span className="demo-detail-badge">🏃 운동/스포츠</span>
            <span className="demo-detail-status">모집중</span>
          </div>

          <div className="demo-detail-author">
            <span className="demo-detail-avatar" />
            <span>러너지훈 · 방금 전</span>
          </div>

          <div className="demo-detail-image" />

          <div className="demo-detail-lines">
            <span></span>
            <span></span>
            <span className="short"></span>
          </div>

          <div className="demo-detail-comment">
            <span className="demo-detail-avatar small" />
            <div>
              <p className="c-name">달리기좋아</p>
              <p className="c-text">저도 참여하고 싶어요! 몇 시에 모이나요?</p>
            </div>
          </div>

          <div className="demo-detail-comment">
            <span className="demo-detail-avatar small" />
            <div>
              <p className="c-name">한강뷰맛집</p>
              <p className="c-text">토요일 7시 반포한강공원 어때요 🙌</p>
            </div>
          </div>

          <div className="demo-detail-comment">
            <span className="demo-detail-avatar small" />
            <div>
              <p className="c-name">주말러너</p>
              <p className="c-text">좋습니다! 신청할게요 🏃‍♂️</p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-scroll-track">
        <span className="demo-scroll-thumb"></span>
      </div>
    </div>
  );
}

const SCENES = [SceneLike, SceneFilter, SceneDetail];

export default function ProductDemo() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setScene((s) => (s + 1) % SCENES.length),
      SCENE_DURATIONS_MS[scene]
    );
    return () => clearTimeout(timer);
  }, [scene]);

  const Scene = SCENES[scene];

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
          <Scene key={scene} />
        </div>

        <div className="demo-scene-dots">
          {SCENES.map((_, i) => (
            <span
              key={i}
              className={`demo-scene-dot${i === scene ? " active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
