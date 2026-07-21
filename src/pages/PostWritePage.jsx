import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import PostForm from "../components/PostForm";

const ERROR_MAP = {
  TITLE_REQUIRED: "제목을 입력해주세요.",
  TITLE_LENGTH_EXCEEDED: "제목은 최대 30자까지 입력 가능합니다.",
  CONTENT_REQUIRED: "내용을 입력해주세요.",
  IMAGE_REQUIRED: "이미지를 선택해주세요.",
  POST_RATE_LIMIT_EXCEEDED: "게시글을 너무 자주 작성했습니다. 잠시 후 다시 시도해주세요.",
};

export default function PostWritePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  // 실패 시 에러 메시지를 반환 → PostForm이 표시. 성공 시 상세로 이동.
  async function handleSubmit({ title, content, imageUrl }) {
    try {
      const response = await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({ title, content, imageUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        return ERROR_MAP[data.code] || "게시글 작성에 실패했습니다.";
      }
      navigate(`/posts/${data.data.postId}`);
    } catch (err) {
      console.error("게시글 작성 실패", err);
      return "서버 오류가 발생했습니다. 다시 시도해주세요.";
    }
  }

  return (
    <>
      <ProfileHeader onBack={() => navigate("/posts")} />
      <PostForm mode="write" initialData={null} onSubmit={handleSubmit} />
    </>
  );
}
