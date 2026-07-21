import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatCount, formatDate } from "../utils/format";
import ProfileHeader from "../components/ProfileHeader";
import PostHeader from "../components/PostHeader";
import PostImage from "../components/PostImage";
import PostBody from "../components/PostBody";
import PostStats from "../components/PostStats";
import PostDeleteModal from "../components/PostDeleteModal";
import CommentSection from "../components/CommentSection";

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [postDeleteModalOpen, setPostDeleteModalOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  async function loadPost() {
    try {
      const response = await apiFetch(`/posts/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        setLoadError(true);
        return;
      }

      const loaded = data.data;
      setPost(loaded);
      // 좋아요 상태는 서버 응답을 단일 출처로 삼는다.
      setIsLiked(loaded.isLikedByMe);
      setCurrentLikeCount(loaded.likeCount);
      setLoadError(false);
    } catch (err) {
      console.error("게시글 로드 실패", err);
      setLoadError(true);
    }
  }

  // 인증 가드 + 게시글 로드 (postId 바뀌면 다시)
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function handleLikeToggle() {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      const response = await apiFetch(`/posts/${postId}/likes`, {
        method: isLiked ? "DELETE" : "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLiked(data.data.isLikedByMe);
        setCurrentLikeCount(data.data.likeCount);
      }
    } catch (err) {
      console.error("좋아요 실패", err);
    } finally {
      setIsLikeLoading(false);
    }
  }

  async function handleDeletePost() {
    try {
      const response = await apiFetch(`/posts/${postId}`, { method: "DELETE" });
      if (response.ok) navigate("/posts");
    } catch (err) {
      console.error("게시글 삭제 실패", err);
    } finally {
      setPostDeleteModalOpen(false);
    }
  }

  return (
    <>
      <ProfileHeader onBack={() => navigate("/posts")} />
      <main className="detail-main">
        <div className="container">
          {loadError && (
            <p className="list-message">게시글을 불러오지 못했습니다.</p>
          )}

          {post && (
            <>
              <PostHeader
                title={post.isBlind ? "숨김 처리된 게시글" : post.title}
                writerNickname={post.writerNickname}
                date={formatDate(post.createdAt)}
                isMine={post.isMine}
                onEdit={() => navigate(`/post-edit?postId=${postId}`)}
                onDelete={() => setPostDeleteModalOpen(true)}
              />

              {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}

              <PostBody content={post.content} />

              <PostStats
                likeCount={formatCount(currentLikeCount)}
                isLiked={isLiked}
                isLikeLoading={isLikeLoading}
                onLikeClick={handleLikeToggle}
                viewCount={formatCount(post.viewCount)}
                commentCount={formatCount(post.comments.length)}
              />

              <hr className="divider" />

              <CommentSection
                postId={postId}
                comments={post.comments}
                onCommentsChanged={loadPost}
              />
            </>
          )}
        </div>
      </main>

      <PostDeleteModal
        isOpen={postDeleteModalOpen}
        onCancel={() => setPostDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
      />
    </>
  );
}
