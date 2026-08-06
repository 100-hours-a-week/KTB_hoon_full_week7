import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import PostForm from "../components/PostForm";
import DraftsModal from "../components/DraftsModal";
import Toast from "../components/Toast";
import { RECRUIT_ERROR_MESSAGES } from "../constants/recruit";

const ERROR_MAP = {
  ...RECRUIT_ERROR_MESSAGES,
  NOT_POST_DRAFT_WRITER: "본인의 임시저장 글만 발행할 수 있습니다.",
  POST_DRAFT_NOT_FOUND: "임시저장 글을 찾을 수 없습니다.",
};

export default function PostWritePage() {
  const navigate = useNavigate();

  // 현재 편집 중인 임시저장 글 id (신규 작성이면 null)
  const [draftId, setDraftId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  // 임시저장 글을 불러오면 폼을 새 초기값으로 리마운트하기 위한 key
  const [formKey, setFormKey] = useState(0);

  const [draftsModalOpen, setDraftsModalOpen] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [savingDraft, setSavingDraft] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  }

  // 발행: 임시저장에서 온 글이면 publish, 아니면 일반 생성
  async function handleSubmit(payload) {
    const path = draftId ? `/posts/drafts/${draftId}/publish` : "/posts";
    try {
      const response = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return ERROR_MAP[data.code] || "모집글 등록에 실패했습니다.";
      }
      navigate(`/posts/${data.data.postId}`);
    } catch (err) {
      console.error("모집글 등록 실패", err);
      return "서버 오류가 발생했습니다. 다시 시도해주세요.";
    }
  }

  // 임시저장: 최초엔 생성(POST), 이후엔 수정(PATCH)
  async function handleSaveDraft({ title, content, imageUrl }) {
    if (savingDraft) return;
    setSavingDraft(true);
    const path = draftId ? `/posts/drafts/${draftId}` : "/posts/drafts";
    try {
      const response = await apiFetch(path, {
        method: draftId ? "PATCH" : "POST",
        body: JSON.stringify({ title, content, imageUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        showToast(ERROR_MAP[data.code] || "임시저장에 실패했습니다.");
        return;
      }
      if (!draftId) setDraftId(data.data.draftId);
      showToast("임시저장되었습니다.");
    } catch (err) {
      console.error("임시저장 실패", err);
      showToast("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSavingDraft(false);
    }
  }

  async function openDraftsModal() {
    try {
      const response = await apiFetch("/posts/drafts");
      const data = await response.json();
      if (response.ok) {
        setDrafts(data.data || []);
        setDraftsModalOpen(true);
      }
    } catch (err) {
      console.error("임시저장 목록 로드 실패", err);
    }
  }

  // 임시저장 글 불러오기 → 폼을 해당 내용으로 리마운트
  async function loadDraft(id) {
    try {
      const response = await apiFetch(`/posts/drafts/${id}`);
      const data = await response.json();
      if (response.ok) {
        const d = data.data;
        setInitialData({
          title: d.title ?? "",
          content: d.content ?? "",
          imageUrl: d.imageUrl ?? null,
        });
        setDraftId(d.draftId);
        setFormKey((prev) => prev + 1);
        setDraftsModalOpen(false);
      }
    } catch (err) {
      console.error("임시저장 글 로드 실패", err);
    }
  }

  async function deleteDraft(id) {
    try {
      const response = await apiFetch(`/posts/drafts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDrafts((prev) => prev.filter((d) => d.draftId !== id));
        // 편집 중이던 글을 지웠다면 신규 작성 상태로 되돌린다
        if (id === draftId) setDraftId(null);
      }
    } catch (err) {
      console.error("임시저장 글 삭제 실패", err);
    }
  }

  return (
    <>
      <ProfileHeader onBack={() => navigate("/posts")} />
      <PostForm
        key={formKey}
        mode="write"
        initialData={initialData}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        onOpenDrafts={openDraftsModal}
        savingDraft={savingDraft}
      />

      <DraftsModal
        isOpen={draftsModalOpen}
        drafts={drafts}
        onSelect={loadDraft}
        onDelete={deleteDraft}
        onClose={() => setDraftsModalOpen(false)}
      />

      <Toast message={toastMessage} />
    </>
  );
}
