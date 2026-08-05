import { useState } from "react";
import TitleField from "./TitleField";
import ContentField from "./ContentField";
import ImageField from "./ImageField";
import Button from "./Button";

const DEFAULT_IMAGE_URL = "https://cdn.example.com/post/default.png";

function fileNameFromUrl(imageUrl) {
  return imageUrl ? imageUrl.split("/").pop() : "기존 파일 명";
}

// 작성/수정 공통 폼. mode와 initialData로 차이를 분기
export default function PostForm({ mode, initialData, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ?? DEFAULT_IMAGE_URL
  );
  const [fileName, setFileName] = useState(
    mode === "edit"
      ? fileNameFromUrl(initialData?.imageUrl)
      : "파일을 선택해주세요."
  );
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActive = title.trim() && content.trim();
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

  return (
    <main className="write-main">
      <h2>{heading}</h2>
      <div className="form-section">
        <TitleField value={title} error={titleError} onChange={setTitle} />
        <ContentField
          value={content}
          error={contentError}
          onChange={setContent}
        />
        <ImageField fileName={fileName} onFileSelect={handleFileSelect} />
        <Button
          label={submitLabel}
          variant="primary"
          className={isActive ? "active" : ""}
          onClick={handleSubmit}
          disabled={!isActive || isSubmitting}
        />
      </div>
    </main>
  );
}
