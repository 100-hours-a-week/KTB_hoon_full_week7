import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import PageGreeting from "../components/PageGreeting";
import Button from "../components/Button";
import PostList from "../components/PostList";
import LoadingSpinner from "../components/LoadingSpinner";
import ListMessage from "../components/ListMessage";
import { SearchIcon } from "../components/icons";

const LOAD_ERROR_MESSAGE = "모집글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
const EMPTY_MESSAGE = "아직 등록된 모집글이 없습니다.";
const EMPTY_SEARCH_MESSAGE = "검색 결과가 없습니다.";

export default function PostsPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [listMessage, setListMessage] = useState("");

  const [keyword, setKeyword] = useState(""); // 입력값
  const [activeKeyword, setActiveKeyword] = useState(""); // 실제 적용된 검색어

  const sentinelRef = useRef(null);

  // 무한 스크롤. activeKeyword 유무에 따라 목록/검색 엔드포인트를 고른다.
  useEffect(() => {
    async function loadPosts() {
      if (isLoading || !hasNext) return;

      setIsLoading(true);
      setListMessage("");

      try {
        const cursorParam = nextCursor ? `&cursor=${nextCursor}` : "";
        const url = activeKeyword
          ? `/posts/search?keyword=${encodeURIComponent(activeKeyword)}&size=10${cursorParam}`
          : `/posts?size=10${cursorParam}`;
        const response = await apiFetch(url);
        const data = await response.json();

        if (!response.ok) {
          setListMessage(LOAD_ERROR_MESSAGE);
          return;
        }

        const newPosts = data.data.data;
        setPosts((prev) => [...prev, ...newPosts]);
        setNextCursor(data.data.nextCursor);
        setHasNext(data.data.hasNext);

        if (nextCursor === null && newPosts.length === 0) {
          setListMessage(activeKeyword ? EMPTY_SEARCH_MESSAGE : EMPTY_MESSAGE);
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
  }, [nextCursor, hasNext, isLoading, activeKeyword]);

  // 검색어를 바꾸면 목록을 처음부터 다시 불러온다.
  function applySearch(kw) {
    setPosts([]);
    setNextCursor(null);
    setHasNext(true);
    setListMessage("");
    setActiveKeyword(kw);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const kw = keyword.trim();
    if (!kw || kw === activeKeyword) return;
    applySearch(kw);
  }

  function handleClearSearch() {
    setKeyword("");
    if (activeKeyword) applySearch("");
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
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <SearchIcon className="search-icon" />
            <input
              className="search-input"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="모집글 검색 (제목·내용)"
            />
            {(keyword || activeKeyword) && (
              <button
                type="button"
                className="search-clear"
                onClick={handleClearSearch}
                aria-label="검색 지우기"
              >
                ×
              </button>
            )}
          </form>
          <Button
            label="모집글 작성"
            variant="primary"
            className="btn-write"
            onClick={() => navigate("/post-write")}
          />
        </div>

        {activeKeyword && (
          <p className="search-result-head">
            <strong>‘{activeKeyword}’</strong> 검색 결과
          </p>
        )}

        <PostList posts={posts} onPostClick={handlePostClick} />
        <ListMessage message={listMessage} />
        <LoadingSpinner visible={isLoading} ref={sentinelRef} />
      </main>
    </>
  );
}
