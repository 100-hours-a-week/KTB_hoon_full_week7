import { useState } from "react";
import { apiFetch } from "../api";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentDeleteModal from "./CommentDeleteModal";

export default function CommentSection({
  postId,
  comments,
  onCommentsChanged,
  onReportComment,
}) {
  const [commentInputValue, setCommentInputValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentDeleteModalOpen, setCommentDeleteModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  async function handleCreate() {
    const content = commentInputValue.trim();
    if (!content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await apiFetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setCommentInputValue("");
        onCommentsChanged();
      }
    } catch (err) {
      console.error("댓글 등록 실패", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(comment) {
    setEditingCommentId(comment.commentId);
    setEditingValue(comment.content);
  }

  function cancelEdit() {
    setEditingCommentId(null);
    setEditingValue("");
  }

  async function submitEdit() {
    const content = editingValue.trim();
    if (!content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await apiFetch(
        `/posts/${postId}/comments/${editingCommentId}`,
        { method: "PATCH", body: JSON.stringify({ content }) }
      );
      if (response.ok) {
        cancelEdit();
        onCommentsChanged();
      }
    } catch (err) {
      console.error("댓글 수정 실패", err);
    } finally {
      setIsSubmitting(false);
    }
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
        onSubmit={handleCreate}
        disabled={isSubmitting}
      />
      <CommentList
        comments={comments}
        editingCommentId={editingCommentId}
        editValue={editingValue}
        onStartEdit={startEdit}
        onDeleteComment={openDeleteModal}
        onReportComment={onReportComment}
        onEditChange={setEditingValue}
        onEditSubmit={submitEdit}
        onEditCancel={cancelEdit}
      />
      <CommentDeleteModal
        isOpen={commentDeleteModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
