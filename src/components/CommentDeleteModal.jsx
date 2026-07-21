import ConfirmModal from "./ConfirmModal";

export default function CommentDeleteModal({ isOpen, onCancel, onConfirm }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="댓글을 삭제하시겠습니까?"
      description="삭제한 내용은 복구 할 수 없습니다."
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
