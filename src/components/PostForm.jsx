import { useState } from "react";
import TitleField from "./TitleField";
import ContentField from "./ContentField";
import ImageField from "./ImageField";
import Button from "./Button";

const DEFAULT_IMAGE_URL = "https://cdn.example.com/post/default.png";

function fileNameFromUrl(imageUrl) {
  return imageUrl ? imageUrl.split("/").pop() : "기존 파일 명";
}

// 작성/수정 공통 폼. mode와 initialData로 차이를 분기.
// write 모드에서는 임시저장(onSaveDraft)·불러오기(onOpenDrafts)를 추가로 노출한다.
export default function PostForm({
  mode,
  initialData,
  onSubmit,
  onSaveDraft,
  onOpenDrafts,
  savingDraft = false,
}) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ?? DEFAULT_IMAGE_URL
  );
  const [fileName, setFileName] = useState(() => {
    if (initialData?.imageUrl) return fileNameFromUrl(initialData.imageUrl);
    return mode === "edit" ? "기존 파일 명" : "파일을 선택해주세요.";
  });
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActive = title.trim() && content.trim();
  const isWrite = mode !== "edit";
  // 임시저장은 제목/내용 중 하나라도 있으면 가능(둘 다 비면 저장할 게 없음)
  const canSaveDraft = isWrite && (title.trim() || content.trim());
  const heading = mode === "edit" ? "모집글 수정" : "모집글 작성";
  const submitLabel = mode === "edit" ? "수정하기" : "완료";

  function handleFileSelect(file) {
    setFileName(file.name);
    // 업로드 로직이 없으므로 imageUrl은 고정값/기존값 유지
    setImageUrl(initialData?.imageUrl || DEFAULT_IMAGE_URL);
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    setTitleError("");
    setContentError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    let valid = true;
    if (!trimmedTitle) {
      setTitleError("제목을 입력해주세요.");
      valid = false;
    }
    if (!trimmedContent) {
      setContentError("내용을 입력해주세요.");
      valid = false;
    }
    if (!valid) return;

    setIsSubmitting(true);
    // 성공 시 페이지가 이동하므로 반환값(에러 메시지)이 있을 때만 표시
    const errorMessage = await onSubmit({
      title: trimmedTitle,
      content: trimmedContent,
      imageUrl,
    });
    if (errorMessage) {
      setTitleError(errorMessage);
      setIsSubmitting(false);
    }
  }

  // 임시저장은 검증 없이 현재 값을 그대로 넘긴다(빈 필드 허용).
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
        <ContentField
          value={content}
          error={contentError}
          onChange={setContent}
        />
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
