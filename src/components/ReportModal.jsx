import { useEffect, useState } from "react";
import useScrollLock from "../hooks/useScrollLock";

// 신고 사유 (API 명세 §6.2 ReportReason enum). value는 서버 enum 이름 그대로 전송한다.
const REPORT_REASONS = [
  { value: "SPAM", label: "스팸" },
  { value: "ABUSE", label: "욕설/비하" },
  { value: "INAPPROPRIATE", label: "부적절한 콘텐츠" },
  { value: "ADVERTISEMENT", label: "광고" },
  { value: "ETC", label: "기타" },
];

// 신고 사유를 고른 뒤 확인하는 모달. isOpen 동안 배경 스크롤을 막는다.
// targetLabel 로 게시글/댓글 등 대상 문구만 바꿔 재사용한다.
export default function ReportModal({
  isOpen,
  targetLabel = "모집글",
  error,
  isSubmitting,
  onCancel,
  onConfirm,
}) {
  useScrollLock(isOpen);
  const [reason, setReason] = useState("");

  // 모달이 닫히면 선택을 초기화해 다음에 열 때 깨끗한 상태로 시작한다.
  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  return (
    <div className={`modal-overlay${isOpen ? " show" : ""}`}>
      <div className="modal">
        <p className="modal-title">{targetLabel}을 신고하시겠습니까?</p>
        <p className="modal-desc">신고 사유를 선택해주세요.</p>

        <div className="report-reason-list">
          {REPORT_REASONS.map((r) => (
            <label
              key={r.value}
              className={`report-reason${reason === r.value ? " selected" : ""}`}
            >
              <input
                type="radio"
                name="report-reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>

        {error && <p className="report-error">{error}</p>}

        <div className="modal-btn-group">
          <button className="modal-btn cancel" onClick={onCancel}>
            취소
          </button>
          <button
            className="modal-btn"
            onClick={() => onConfirm(reason)}
            disabled={!reason || isSubmitting}
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
