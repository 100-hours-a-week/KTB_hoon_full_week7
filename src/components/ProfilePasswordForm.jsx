import { useState } from "react";
import { apiFetch } from "../api";
import PasswordField from "./PasswordField";
import PasswordConfirmField from "./PasswordConfirmField";
import Button from "./Button";

const PASSWORD_HELPER_DEFAULT =
  "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.";
const PASSWORD_ERROR_MAP = {
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  INVALID_PASSWORD_FORMAT: PASSWORD_HELPER_DEFAULT,
  PASSWORD_CONFIRM_REQUIRED: "비밀번호를 한번 더 입력해주세요.",
  PASSWORD_CONFIRM_MISMATCH: "비밀번호가 다릅니다.",
};

function isValidPassword(password) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/.test(password);
}

export default function ProfilePasswordForm({ onUpdated }) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActive =
    password &&
    passwordConfirm &&
    isValidPassword(password) &&
    password === passwordConfirm;

  async function handleSubmit() {
    if (isSubmitting) return;

    // 안내는 placeholder가 담당 → 재검증 전 이전 에러만 초기화
    setPasswordError("");
    setPasswordConfirmError("");

    let isValid = true;
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
        body: JSON.stringify({ password, passwordConfirm }),
      });
      const data = await response.json();

      if (!response.ok) {
        setPasswordError(PASSWORD_ERROR_MAP[data.code] || "수정에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      // 성공 시 페이지가 토스트 표시 후 /profile 로 이동한다.
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
        value={password}
        error={passwordError}
        onChange={setPassword}
      />
      <PasswordConfirmField
        value={passwordConfirm}
        error={passwordConfirmError}
        onChange={setPasswordConfirm}
      />
      <Button
        label="수정하기"
        variant="login"
        className={isActive ? "active" : ""}
        onClick={handleSubmit}
        disabled={!isActive}
      />
    </div>
  );
}
