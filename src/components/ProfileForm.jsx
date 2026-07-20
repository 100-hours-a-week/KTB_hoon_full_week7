import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import ProfileImageField from "./ProfileImageField";
import NicknameField from "./NicknameField";
import Button from "./Button";

const PROFILE_ERROR_MAP = {
  NICKNAME_REQUIRED: "닉네임을 입력해주세요.",
  INVALID_NICKNAME_FORMAT: "닉네임은 최대 10자까지 입력 가능합니다.",
  NICKNAME_DUPLICATED: "중복 닉네임입니다.",
  IMAGE_REQUIRED: "프로필 이미지를 선택해주세요.",
};
const DEFAULT_IMAGE = "/images/default-profile.png";
const PLACEHOLDER_IMAGE_URL = "https://cdn.example.com/profile/u1.png";

function isValidNickname(nickname) {
  return /^[^\s]{1,10}$/.test(nickname);
}

export default function ProfileForm({ onUpdated }) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_IMAGE);
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE_URL);
  const [nicknameError, setNicknameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isActive = nickname && isValidNickname(nickname) && nickname !== originalNickname;

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const response = await apiFetch("/profile");
        const data = await response.json();
        if (response.ok) {
          setEmail(data.data.email);
          setNickname(data.data.nickname);
          setOriginalNickname(data.data.nickname);
        }
      } catch (err) {
        console.error("유저 정보 로드 실패", err);
      }
    }
    loadUserInfo();
  }, []);

  function handleNicknameChange(value) {
    setNickname(value.replace(/\s/g, ""));
  }

  function handleFileChange(file) {
    setPreviewUrl(URL.createObjectURL(file));
    setImageUrl(PLACEHOLDER_IMAGE_URL);
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    // 안내는 placeholder가 담당 → 재검증 전 이전 에러만 초기화
    setNicknameError("");

    if (!nickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length > 10) {
      setNicknameError("닉네임은 최대 10자까지 입력 가능합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({ nickname, imageUrl }),
      });
      const data = await response.json();

      if (!response.ok) {
        setNicknameError(PROFILE_ERROR_MAP[data.code] || "수정에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      setOriginalNickname(nickname);
      onUpdated("수정완료");
      setIsSubmitting(false);
    } catch (err) {
      console.error("요청 실패", err);
      setNicknameError("서버 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-section">
      <ProfileImageField previewUrl={previewUrl} onFileChange={handleFileChange} error=""/>
      <div className="field">
        <label>이메일</label>
        <p className="email-text">{email}</p>
      </div>
      <NicknameField value={nickname} error={nicknameError} onChange={handleNicknameChange}/>
      <Button label="수정하기" variant="login" className={isActive ? "active" : ""} onClick={handleSubmit} disabled={!isActive}/>
    </div>
  );
}
