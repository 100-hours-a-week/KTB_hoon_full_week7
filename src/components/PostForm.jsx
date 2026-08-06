import { useState } from "react";
import TitleField from "./TitleField";
import ContentField from "./ContentField";
import ImageField from "./ImageField";
import Button from "./Button";
import RegionSelect from "./RegionSelect";
import { CATEGORIES, MEETING_TYPES } from "../constants/recruit";

const DEFAULT_IMAGE_URL = "https://cdn.example.com/post/default.png";

function fileNameFromUrl(imageUrl) {
  return imageUrl ? imageUrl.split("/").pop() : "기존 파일 명";
}

// 작성/수정 공통 폼. write 모드에서는 임시저장/불러오기도 노출한다.
export default function PostForm({
  mode,
  initialData,
  onSubmit,
  onSaveDraft,
  onOpenDrafts,
  savingDraft = false,
}) {
  const addr = initialData?.address || {};

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ?? DEFAULT_IMAGE_URL
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [meetingType, setMeetingType] = useState(
    initialData?.meetingType ?? "OFFLINE"
  );
  const [sido, setSido] = useState(addr.sido ?? "");
  const [sigungu, setSigungu] = useState(addr.sigungu ?? "");
  const [eupmyeondong, setEupmyeondong] = useState(addr.eupmyeondong ?? "");
  const [detail, setDetail] = useState(addr.detail ?? "");
  const [placeName, setPlaceName] = useState(initialData?.placeName ?? "");
  const [capacity, setCapacity] = useState(
    initialData?.capacity != null ? String(initialData.capacity) : ""
  );

  const [fileName, setFileName] = useState(() => {
    if (initialData?.imageUrl) return fileNameFromUrl(initialData.imageUrl);
    return mode === "edit" ? "기존 파일 명" : "파일을 선택해주세요.";
  });

  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [placeError, setPlaceError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOffline = meetingType === "OFFLINE";
  const isWrite = mode !== "edit";
  const canSaveDraft = isWrite && (title.trim() || content.trim());
  const heading = mode === "edit" ? "모집글 수정" : "모집글 작성";
  const submitLabel = mode === "edit" ? "수정하기" : "완료";

  const isActive =
    title.trim() &&
    content.trim() &&
    category &&
    placeName.trim() &&
    (!isOffline || (sido.trim() && sigungu.trim() && eupmyeondong.trim()));

  function handleFileSelect(file) {
    setFileName(file.name);
    setImageUrl(initialData?.imageUrl || DEFAULT_IMAGE_URL);
  }

  function validate() {
    setTitleError("");
    setContentError("");
    setCategoryError("");
    setAddressError("");
    setPlaceError("");
    setCapacityError("");

    let ok = true;
    if (!title.trim()) {
      setTitleError("제목을 입력해주세요.");
      ok = false;
    }
    if (!content.trim()) {
      setContentError("내용을 입력해주세요.");
      ok = false;
    }
    if (!category) {
      setCategoryError("카테고리를 선택해주세요.");
      ok = false;
    }
    if (isOffline && !(sido.trim() && sigungu.trim() && eupmyeondong.trim())) {
      setAddressError("시/도, 시/군/구, 읍/면/동을 모두 입력해주세요.");
      ok = false;
    }
    if (!placeName.trim()) {
      setPlaceError("장소명을 입력해주세요.");
      ok = false;
    } else if (placeName.trim().length > 50) {
      setPlaceError("장소명은 최대 50자까지 입력 가능합니다.");
      ok = false;
    }
    if (capacity && !(Number(capacity) > 0)) {
      setCapacityError("모집 인원은 1명 이상이어야 합니다.");
      ok = false;
    }
    return ok;
  }

  function buildPayload() {
    return {
      title: title.trim(),
      content: content.trim(),
      imageUrl,
      category,
      meetingType,
      address: isOffline
        ? {
            sido: sido.trim(),
            sigungu: sigungu.trim(),
            eupmyeondong: eupmyeondong.trim(),
            detail: detail.trim() || null,
          }
        : null,
      placeName: placeName.trim(),
      capacity: capacity ? Number(capacity) : null,
    };
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    const errorMessage = await onSubmit(buildPayload());
    if (errorMessage) {
      setTitleError(errorMessage);
      setIsSubmitting(false);
    }
  }

  // 임시저장은 모집 정보 없이 title/content/imageUrl만 저장한다(명세 §4.5).
  function handleSaveDraft() {
    if (!canSaveDraft || savingDraft) return;
    onSaveDraft({ title: title.trim(), content: content.trim(), imageUrl });
  }

  return (
    <main className="write-main">
      <h2>{heading}</h2>
      <div className="form-section">
        {isWrite && (
          <button type="button" className="btn-drafts-open" onClick={onOpenDrafts}>
            임시저장 글 불러오기
          </button>
        )}

        <TitleField value={title} error={titleError} onChange={setTitle} />
        <ContentField value={content} error={contentError} onChange={setContent} />

        {/* 카테고리 */}
        <div className="form-group">
          <label>카테고리*</label>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`cat-chip${category === c.value ? " selected" : ""}`}
                onClick={() => {
                  setCategory(c.value);
                  setCategoryError("");
                }}
              >
                <span className="cat-emoji">{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
          {categoryError && <small className="helper-text">{categoryError}</small>}
        </div>

        {/* 모임 방식 */}
        <div className="form-group">
          <label>모임 방식*</label>
          <div className="segmented">
            {MEETING_TYPES.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`seg-option${meetingType === m.value ? " selected" : ""}`}
                onClick={() => {
                  setMeetingType(m.value);
                  setAddressError("");
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 지역 (오프라인만) */}
        {isOffline && (
          <div className="form-group">
            <label>지역*</label>
            <RegionSelect
              sido={sido}
              sigungu={sigungu}
              onSidoChange={setSido}
              onSigunguChange={setSigungu}
            />
            <input
              className="address-detail"
              value={eupmyeondong}
              onChange={(e) => setEupmyeondong(e.target.value)}
              placeholder="읍/면/동"
            />
            <input
              className="address-detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="상세 주소 (선택)"
            />
            {addressError && <small className="helper-text">{addressError}</small>}
          </div>
        )}

        {/* 장소명 */}
        <div className="form-group">
          <label>{isOffline ? "장소명*" : "모임 장소*"}</label>
          <input
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder={isOffline ? "예: 대치중학교 운동장" : "예: 디스코드, Zoom"}
            maxLength={50}
          />
          {placeError && <small className="helper-text">{placeError}</small>}
        </div>

        {/* 모집 인원 */}
        <div className="form-group">
          <label>모집 인원 (선택)</label>
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="예: 6"
          />
          {capacityError && <small className="helper-text">{capacityError}</small>}
        </div>

        <ImageField fileName={fileName} onFileSelect={handleFileSelect} />

        {isWrite ? (
          <div className="write-actions">
            <button
              type="button"
              className="btn-draft"
              onClick={handleSaveDraft}
              disabled={!canSaveDraft || savingDraft || isSubmitting}
            >
              {savingDraft ? "저장 중..." : "임시저장"}
            </button>
            <button
              type="button"
              className={`btn-primary${isActive ? " active" : ""}`}
              onClick={handleSubmit}
              disabled={!isActive || isSubmitting}
            >
              {submitLabel}
            </button>
          </div>
        ) : (
          <Button
            label={submitLabel}
            variant="primary"
            className={isActive ? "active" : ""}
            onClick={handleSubmit}
            disabled={!isActive || isSubmitting}
          />
        )}
      </div>
    </main>
  );
}
