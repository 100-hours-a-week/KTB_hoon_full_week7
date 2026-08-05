import { useState } from "react";
import { apiFetch } from "../api";
import PasswordField from "./PasswordField";
import PasswordConfirmField from "./PasswordConfirmField";
import Button from "./Button";

const PASSWORD_HELPER_DEFAULT =
  "영문, 숫자, 특수문자를 각각 최소 1개 포함해 8~20자로 입력해주세요.";
const PASSWORD_ERROR_MAP = {
  CURRENT_PASSWORD_REQUIRED: "현재 비밀번호를 입력해주세요.",
  CURRENT_PASSWORD_MISMATCH: "현재 비밀번호가 올바르지 않습니다.",
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  INVALID_PASSWORD_FORMAT: PASSWORD_HELPER_DEFAULT,
  PASSWORD_CONFIRM_REQUIRED: "비밀번호를 한번 더 입력해주세요.",
  PASSWORD_CONFIRM_MISMATCH: "비밀번호가 다릅니다.",
};

// 서버 @ValidPassword 규칙: 영문·숫자·특수문자 각 1자 이상, 8~20자
function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/.test(password);
}

export default function ProfilePasswordForm({ onUpdated }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActive =
    currentPassword &&
    password &&
    passwordConfirm &&
    isValidPassword(password) &&
    password === passwordConfirm;

  function handleCurrentPasswordChange(value) {
    setCurrentPassword(value);
    setCurrentPasswordError("");
  }

  // 입력할 때마다 실시간 검증 → 헬퍼텍스트 즉시 갱신
  function handlePasswordChange(value) {
    setPassword(value);

    if (!value) {
      setPasswordError(""); // 비어 있으면 placeholder가 안내 담당
    } else if (!isValidPassword(value)) {
      setPasswordError(PASSWORD_HELPER_DEFAULT);
    } else {
      setPasswordError("");
    }

    // 비밀번호가 바뀌면 확인 필드의 일치 여부도 다시 검사
    if (passwordConfirm && value !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 다릅니다.");
    } else {
      setPasswordConfirmError("");
    }
  }

  function handlePasswordConfirmChange(value) {
    setPasswordConfirm(value);

    if (!value) {
      setPasswordConfirmError("");
    } else if (value !== password) {
      setPasswordConfirmError("비밀번호가 다릅니다.");
    } else {
      setPasswordConfirmError("");
    }
  }

  function applyErrorByCode(code) {
    const message = PASSWORD_ERROR_MAP[code] || "수정에 실패했습니다.";
    if (code === "CURRENT_PASSWORD_REQUIRED" || code === "CURRENT_PASSWORD_MISMATCH") {
      setCurrentPasswordError(message);
    } else if (code === "PASSWORD_CONFIRM_REQUIRED" || code === "PASSWORD_CONFIRM_MISMATCH") {
      setPasswordConfirmError(message);
    } else {
      setPasswordError(message);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    // 안내는 placeholder가 담당 → 재검증 전 이전 에러만 초기화
    setCurrentPasswordError("");
    setPasswordError("");
    setPasswordConfirmError("");

    let isValid = true;
    if (!currentPassword) {
      setCurrentPasswordError("현재 비밀번호를 입력해주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(PASSWORD_HELPER_DEFAULT);
      isValid = false;
    }
    if (!passwordConfirm) {
      setPasswordConfirmError("비밀번호를 한번 더 입력해주세요.");
      isValid = false;
    } else if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 다릅니다.");
      isValid = false;
    }
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/profile/pw", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, password, passwordConfirm }),
      });
      const data = await response.json();

      if (!response.ok) {
        applyErrorByCode(data.code);
        setIsSubmitting(false);
        return;
      }

      // 성공 시 페이지가 토스트 표시 후 이동한다.
      onUpdated("수정완료");
    } catch (err) {
      console.error("요청 실패", err);
      setPasswordError("서버 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-section">
      <PasswordField
        label="현재 비밀번호"
        value={currentPassword}
        error={currentPasswordError}
        onChange={handleCurrentPasswordChange}
        placeholder="현재 비밀번호를 입력하세요"
      />
      <PasswordField
        label="새 비밀번호"
        value={password}
        error={passwordError}
        onChange={handlePasswordChange}
        placeholder="새 비밀번호를 입력하세요"
      />
      <PasswordConfirmField
        value={passwordConfirm}
        error={passwordConfirmError}
        onChange={handlePasswordConfirmChange}
      />
      <Button
        label="수정하기"
        variant="primary"
        className={isActive ? "active" : ""}
        onClick={handleSubmit}
        disabled={!isActive}
      />
    </div>
  );
}
