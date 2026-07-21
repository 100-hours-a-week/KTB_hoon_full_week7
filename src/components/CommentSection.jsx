import { useState } from "react";
import { apiFetch } from "../api";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentDeleteModal from "./CommentDeleteModal";

// 댓글 상호작용 state와 CRUD API를 소유한다.
// comments 배열 자체는 게시글 로드에 딸려오므로 props로 받고,
// 변경 후에는 onCommentsChanged()(=게시글 재로드)로 최신화한다.
export default function CommentSection({ postId, comments, onCommentsChanged }) {
  const [commentInputValue, setCommentInputValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [commentDeleteModalOpen, setCommentDeleteModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // 등록/수정 겸용: editingCommentId 유무로 POST/PATCH가 갈린다.
  async function handleSubmit() {
    const content = commentInputValue.trim();
    if (!content || isCommentSubmitting) return;

    setIsCommentSubmitting(true);
    try {
      const response = editingCommentId
        ? await apiFetch(`/posts/${postId}/comments/${editingCommentId}`, {
            method: "PATCH",
            body: JSON.stringify({ content }),
          })
        : await apiFetch(`/posts/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ content }),
          });

      if (response.ok) {
        setEditingCommentId(null);
        setCommentInputValue("");
        onCommentsChanged(); // 게시글 재로드로 댓글 목록/개수 갱신
      }
    } catch (err) {
      console.error("댓글 등록/수정 실패", err);
    } finally {
      setIsCommentSubmitting(false);
    }
  }

  // 수정 버튼: 입력창에 기존 내용 채우고 편집 모드로
  function startEdit(comment) {
    setEditingCommentId(comment.commentId);
    setCommentInputValue(comment.content);
  }

  function openDeleteModal(commentId) {
    setDeletingCommentId(commentId);
    setCommentDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setCommentDeleteModalOpen(false);
    setDeletingCommentId(null);
  }

  async function confirmDelete() {
    try {
      const response = await apiFetch(
        `/posts/${postId}/comments/${deletingCommentId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onCommentsChanged();
      }
    } catch (err) {
      console.error("댓글 삭제 실패", err);
    } finally {
      closeDeleteModal();
    }
  }

  return (
    <>
      <CommentForm
        value={commentInputValue}
        onChange={setCommentInputValue}
        onSubmit={handleSubmit}
        isEditing={editingCommentId !== null}
        disabled={isCommentSubmitting}
      />
      <CommentList
        comments={comments}
        onEditComment={startEdit}
        onDeleteComment={openDeleteModal}
      />
      <CommentDeleteModal
        isOpen={commentDeleteModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
