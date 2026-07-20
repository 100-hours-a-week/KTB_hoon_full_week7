export default function WithdrawModal({ isOpen, onCancel, onConfirm }) {
  return (
    <div className={`modal-overlay${isOpen ? " show" : ""}`}>
      <div className="modal">
        <p className="modal-title">회원탈퇴 하시겠습니까?</p>
        <p className="modal-desc">작성된 게시글과 댓글은 삭제됩니다.</p>
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
