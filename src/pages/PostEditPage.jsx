import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import PostForm from "../components/PostForm";

const ERROR_MAP = {
  TITLE_REQUIRED: "제목을 입력해주세요.",
  TITLE_LENGTH_EXCEEDED: "제목은 최대 30자까지 입력 가능합니다.",
  CONTENT_REQUIRED: "내용을 입력해주세요.",
  IMAGE_REQUIRED: "이미지를 선택해주세요.",
  NOT_POST_WRITER: "게시글 작성자만 수정할 수 있습니다.",
  POST_NOT_FOUND: "게시글을 찾을 수 없습니다.",
  POST_RATE_LIMIT_EXCEEDED: "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.",
};

export default function PostEditPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 기존 게시글 로드 (수정 페이지만의 책임). 내 글이 아니면 상세로 되돌린다.
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    async function loadPost() {
      try {
        const response = await apiFetch(`/posts/${postId}`);
        const data = await response.json();
        if (response.ok) {
          const post = data.data;
          if (!post.isMine) {
            navigate(`/posts/${postId}`);
            return;
          }
          setInitialData({
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error("게시글 로드 실패", err);
      }
    }
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function handleSubmit({ title, content, imageUrl }) {
    try {
      const response = await apiFetch(`/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({ title, content, imageUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        return ERROR_MAP[data.code] || "게시글 수정에 실패했습니다.";
      }
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("게시글 수정 실패", err);
      return "서버 오류가 발생했습니다. 다시 시도해주세요.";
    }
  }

  return (
    <>
      <ProfileHeader onBack={() => navigate(`/posts/${postId}`)} />
      {isLoading ? (
        <main className="write-main">
          <p className="list-message">불러오는 중...</p>
        </main>
      ) : (
        <PostForm mode="edit" initialData={initialData} onSubmit={handleSubmit} />
      )}
    </>
  );
}
