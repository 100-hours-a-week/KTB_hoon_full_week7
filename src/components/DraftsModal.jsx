import useScrollLock from "../hooks/useScrollLock";

// 저장된 임시저장 글 목록. 행을 누르면 불러오고, X로 삭제한다.
export default function DraftsModal({ isOpen, drafts, onSelect, onDelete, onClose }) {
  useScrollLock(isOpen);

  return (
    <div className={`modal-overlay${isOpen ? " show" : ""}`}>
      <div className="modal">
        <p className="modal-title">임시저장 글</p>

        {drafts.length === 0 ? (
          <p className="modal-desc">저장된 임시저장 글이 없습니다.</p>
        ) : (
          <ul className="draft-list">
            {drafts.map((draft) => (
              <li key={draft.draftId} className="draft-item">
                <button
                  className="draft-load"
                  onClick={() => onSelect(draft.draftId)}
                >
                  {draft.title || "(제목 없음)"}
                </button>
                <button
                  className="draft-delete"
                  aria-label="임시저장 글 삭제"
                  onClick={() => onDelete(draft.draftId)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="modal-btn-group">
          <button className="modal-btn cancel" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
