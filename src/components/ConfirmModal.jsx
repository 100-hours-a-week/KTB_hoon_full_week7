import useScrollLock from "../hooks/useScrollLock";

// 재사용 가능한 확인 모달. isOpen인 동안 배경 스크롤을 막는다(useScrollLock).
export default function ConfirmModal({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
}) {
  useScrollLock(isOpen);

  return (
    <div className={`modal-overlay${isOpen ? " show" : ""}`}>
      <div className="modal">
        <p className="modal-title">{title}</p>
        <p className="modal-desc">{description}</p>
        <div className="modal-btn-group">
          <button className="modal-btn cancel" onClick={onCancel}>
            취소
          </button>
          <button className="modal-btn" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
