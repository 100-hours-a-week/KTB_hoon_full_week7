import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import PageGreeting from "../components/PageGreeting";
import Button from "../components/Button";
import PostList from "../components/PostList";
import LoadingSpinner from "../components/LoadingSpinner";
import ListMessage from "../components/ListMessage";

const LOAD_ERROR_MESSAGE = "모집글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
const EMPTY_MESSAGE = "아직 등록된 모집글이 없습니다.";

export default function PostsPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [listMessage, setListMessage] = useState("");

  // 관찰할 DOM(로딩 표시)을 가리키는 용도. 이 ref 하나만 쓴다.
  const sentinelRef = useRef(null);

  // 무한 스크롤
  // nextCursor / hasNext / isLoading 이 바뀌면 이 useEffect가 다시 실행
  // 그때마다 옵저버를 새로 달기 때문에, 옵저버는 항상 최신 값을 아는 loadPosts 를 부름
  useEffect(() => {
    async function loadPosts() {
      // 이미 불러오는 중이거나, 더 이상 다음 페이지가 없으면 멈춤
      if (isLoading || !hasNext) return;

      setIsLoading(true);
      setListMessage("");

      try {
        const query = nextCursor ? `?size=10&cursor=${nextCursor}` : `?size=10`;
        const response = await apiFetch(`/posts${query}`);
        const data = await response.json();

        if (!response.ok) {
          setListMessage(LOAD_ERROR_MESSAGE);
          return;
        }

        const newPosts = data.data.data;
        setPosts((prev) => [...prev, ...newPosts]); // 기존 목록 뒤에 이어붙인다
        setNextCursor(data.data.nextCursor);
        setHasNext(data.data.hasNext);

        // 첫 페이지(커서 없음)인데 결과가 비면 "게시글 없음" 안내
        if (nextCursor === null && newPosts.length === 0) {
          setListMessage(EMPTY_MESSAGE);
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

    // 로딩 표시가 화면에 보이면 loadPosts 실행
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadPosts();
    });
    observer.observe(sentinel);

    // 다음 실행 전(또는 화면을 떠날 때) 관찰 해제
    return () => observer.disconnect();
  }, [nextCursor, hasNext, isLoading]);

  function handlePostClick(postId) {
    navigate(`/posts/${postId}`);
  }

  return (
    <>
      <ProfileHeader />
      <main className="posts-main">
        <PageGreeting />

        <div className="write-btn-wrapper">
          <Button
            label="모집글 작성"
            variant="primary"
            className="btn-write"
            onClick={() => navigate("/post-write")}
          />
        </div>

        <PostList posts={posts} onPostClick={handlePostClick} />
        <ListMessage message={listMessage} />
        <LoadingSpinner visible={isLoading} ref={sentinelRef} />
      </main>
    </>
  );
}
