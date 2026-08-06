import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import PageGreeting from "../components/PageGreeting";
import Button from "../components/Button";
import PostList from "../components/PostList";
import LoadingSpinner from "../components/LoadingSpinner";
import ListMessage from "../components/ListMessage";
import RegionSelect from "../components/RegionSelect";
import { SearchIcon, FilterIcon } from "../components/icons";
import {
  CATEGORIES,
  categoryLabel,
  meetingLabel,
  recruitStatusLabel,
} from "../constants/recruit";

const LOAD_ERROR_MESSAGE = "모집글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
const EMPTY_MESSAGE = "아직 등록된 모집글이 없습니다.";
const EMPTY_SEARCH_MESSAGE = "검색 결과가 없습니다.";
const SEARCH_ERROR_MAP = {
  INVALID_DATE_RANGE: "시작일이 종료일보다 늦을 수 없습니다.",
  INVALID_PAGE_SIZE: "잘못된 페이지 크기입니다.",
  INVALID_ENUM_VALUE: "잘못된 필터 값입니다.",
  INVALID_PARAMETER_TYPE: "잘못된 검색 조건입니다.",
};

const MEETING_OPTIONS = [
  { value: "", label: "전체" },
  { value: "ONLINE", label: "온라인" },
  { value: "OFFLINE", label: "오프라인" },
];
const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "RECRUITING", label: "모집중" },
  { value: "CLOSED", label: "모집완료" },
];

const EMPTY_APPLIED = {
  keyword: "",
  category: "",
  meetingType: "",
  recruitStatus: "",
  sido: "",
  sigungu: "",
  from: "",
  to: "",
};

// 적용된 조건이 하나라도 있는지 (목록 vs 필터 결과 구분용)
function hasAnyFilter(a) {
  return Boolean(
    a.keyword ||
      a.category ||
      a.meetingType ||
      a.recruitStatus ||
      a.sido ||
      a.sigungu ||
      a.from ||
      a.to
  );
}

export default function PostsPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [listMessage, setListMessage] = useState("");

  // 입력 중인 필터(draft)
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [recruitStatus, setRecruitStatus] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchError, setSearchError] = useState("");

  // 실제 적용된 검색 조건
  const [applied, setApplied] = useState(EMPTY_APPLIED);

  const sentinelRef = useRef(null);

  const draftFilterCount = [
    category,
    meetingType,
    recruitStatus,
    sido.trim(),
    sigungu.trim(),
    from,
    to,
  ].filter(Boolean).length;

  // 무한 스크롤. 목록·검색이 /posts 단일 엔드포인트로 통합됨(파라미터 전부 선택).
  useEffect(() => {
    function buildUrl() {
      const p = new URLSearchParams();
      p.set("size", "10");
      if (applied.keyword) p.set("keyword", applied.keyword);
      if (applied.category) p.set("category", applied.category);
      if (applied.meetingType) p.set("meetingType", applied.meetingType);
      if (applied.recruitStatus) p.set("recruitStatus", applied.recruitStatus);
      if (applied.sido) p.set("sido", applied.sido);
      if (applied.sigungu) p.set("sigungu", applied.sigungu);
      if (applied.from) p.set("from", applied.from);
      if (applied.to) p.set("to", applied.to);
      if (nextCursor) p.set("cursor", String(nextCursor));
      return `/posts?${p.toString()}`;
    }

    async function loadPosts() {
      if (isLoading || !hasNext) return;

      setIsLoading(true);
      setListMessage("");

      try {
        const response = await apiFetch(buildUrl());
        const data = await response.json();

        if (!response.ok) {
          setListMessage(SEARCH_ERROR_MAP[data.code] || LOAD_ERROR_MESSAGE);
          return;
        }

        const newPosts = data.data.data;
        setPosts((prev) => [...prev, ...newPosts]);
        setNextCursor(data.data.nextCursor);
        setHasNext(data.data.hasNext);

        if (nextCursor === null && newPosts.length === 0) {
          setListMessage(hasAnyFilter(applied) ? EMPTY_SEARCH_MESSAGE : EMPTY_MESSAGE);
        }
      } catch (err) {
        console.error("게시글 로드 실패", err);
        setListMessage(LOAD_ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadPosts();
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [nextCursor, hasNext, isLoading, applied]);

  // 조건을 바꾸면 목록을 처음부터 다시 불러온다.
  function applyAndReset(nextApplied) {
    setPosts([]);
    setNextCursor(null);
    setHasNext(true);
    setListMessage("");
    setApplied(nextApplied);
  }

  // 키워드·필터는 모두 선택. 아무것도 없으면 전체 목록으로 돌아간다.
  function runSearch(e) {
    if (e) e.preventDefault();
    if (from && to && from > to) {
      setSearchError("시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }
    setSearchError("");
    setFiltersOpen(false);
    applyAndReset({
      keyword: keyword.trim(),
      category,
      meetingType,
      recruitStatus,
      sido: sido.trim(),
      sigungu: sigungu.trim(),
      from,
      to,
    });
  }

  function resetDraftFilters() {
    setCategory("");
    setMeetingType("");
    setRecruitStatus("");
    setSido("");
    setSigungu("");
    setFrom("");
    setTo("");
    setSearchError("");
  }

  function clearAll() {
    setKeyword("");
    resetDraftFilters();
    setFiltersOpen(false);
    if (hasAnyFilter(applied)) applyAndReset(EMPTY_APPLIED);
  }

  // 적용된 필터 요약 칩
  const appliedChips = [];
  if (applied.category)
    appliedChips.push({ key: "category", label: categoryLabel(applied.category) });
  if (applied.meetingType)
    appliedChips.push({ key: "meetingType", label: meetingLabel(applied.meetingType) });
  if (applied.recruitStatus)
    appliedChips.push({
      key: "recruitStatus",
      label: recruitStatusLabel(applied.recruitStatus),
    });
  if (applied.sido) appliedChips.push({ key: "sido", label: applied.sido });
  if (applied.sigungu) appliedChips.push({ key: "sigungu", label: applied.sigungu });
  if (applied.from || applied.to)
    appliedChips.push({
      key: "date",
      label: `${applied.from || "…"} ~ ${applied.to || "…"}`,
    });

  function removeAppliedFilter(key) {
    const next = { ...applied };
    if (key === "date") {
      next.from = "";
      next.to = "";
      setFrom("");
      setTo("");
    } else {
      next[key] = "";
      const setters = {
        category: setCategory,
        meetingType: setMeetingType,
        recruitStatus: setRecruitStatus,
        sido: setSido,
        sigungu: setSigungu,
      };
      setters[key]?.("");
    }
    applyAndReset(next);
  }

  function handlePostClick(postId) {
    navigate(`/posts/${postId}`);
  }

  return (
    <>
      <ProfileHeader />
      <main className="posts-main">
        <PageGreeting />

        <div className="posts-toolbar">
          <form className="search-form" onSubmit={runSearch}>
            <SearchIcon className="search-icon" />
            <input
              className="search-input"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="모집글 검색 (제목·내용)"
            />
            {(keyword || draftFilterCount > 0 || hasAnyFilter(applied)) && (
              <button
                type="button"
                className="search-clear"
                onClick={clearAll}
                aria-label="검색 지우기"
              >
                ×
              </button>
            )}
          </form>

          <button
            type="button"
            className={`btn-filter-toggle${filtersOpen ? " open" : ""}`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <FilterIcon className="filter-ic" />
            필터
            {draftFilterCount > 0 && (
              <span className="filter-count">{draftFilterCount}</span>
            )}
          </button>

          <Button
            label="모집글 작성"
            variant="primary"
            className="btn-write"
            onClick={() => navigate("/post-write")}
          />
        </div>

        {filtersOpen && (
          <div className="filter-panel">
            <div className="filter-block">
              <span className="filter-label">카테고리</span>
              <div className="cat-grid">
                <button
                  type="button"
                  className={`cat-chip${category === "" ? " selected" : ""}`}
                  onClick={() => setCategory("")}
                >
                  전체
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={`cat-chip${category === c.value ? " selected" : ""}`}
                    onClick={() => setCategory(c.value)}
                  >
                    <span className="cat-emoji">{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-two">
              <div className="filter-block">
                <span className="filter-label">모임 방식</span>
                <div className="segmented">
                  {MEETING_OPTIONS.map((m) => (
                    <button
                      key={m.value || "all"}
                      type="button"
                      className={`seg-option${meetingType === m.value ? " selected" : ""}`}
                      onClick={() => setMeetingType(m.value)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-block">
                <span className="filter-label">모집 여부</span>
                <div className="segmented">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value || "all"}
                      type="button"
                      className={`seg-option${recruitStatus === s.value ? " selected" : ""}`}
                      onClick={() => setRecruitStatus(s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-two">
              <div className="filter-block">
                <span className="filter-label">지역 (오프라인)</span>
                <RegionSelect
                  sido={sido}
                  sigungu={sigungu}
                  onSidoChange={setSido}
                  onSigunguChange={setSigungu}
                  includeAll
                />
              </div>

              <div className="filter-block">
                <span className="filter-label">작성일</span>
                <div className="filter-dates">
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                  <span className="date-sep">~</span>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {searchError && <p className="search-error">{searchError}</p>}

            <div className="filter-actions">
              <button type="button" className="btn-draft" onClick={resetDraftFilters}>
                초기화
              </button>
              <button
                type="button"
                className="btn-primary active"
                onClick={() => runSearch()}
              >
                검색
              </button>
            </div>
          </div>
        )}

        {!filtersOpen && searchError && (
          <p className="search-error toolbar-error">{searchError}</p>
        )}

        {hasAnyFilter(applied) && (
          <div className="search-result-head">
            <p>
              {applied.keyword ? (
                <>
                  <strong>‘{applied.keyword}’</strong> 검색 결과
                </>
              ) : (
                "필터 검색 결과"
              )}
            </p>
            {appliedChips.length > 0 && (
              <div className="applied-filters">
                {appliedChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    className="applied-chip"
                    onClick={() => removeAppliedFilter(chip.key)}
                  >
                    {chip.label}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <PostList posts={posts} onPostClick={handlePostClick} />
        <ListMessage message={listMessage} />
        <LoadingSpinner visible={isLoading} ref={sentinelRef} />
      </main>
    </>
  );
}
