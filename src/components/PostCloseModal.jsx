import ConfirmModal from "./ConfirmModal";

export default function PostCloseModal({ isOpen, onCancel, onConfirm }) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="모집을 마감하시겠습니까?"
      description="마감 후에는 다시 모집중 상태로 되돌릴 수 없습니다."
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
