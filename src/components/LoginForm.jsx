import { useState } from "react";
import { apiFetch } from "../api";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import Button from "./Button";

const ERROR_MAP = {
    EMAIL_REQUIRED: "이메일을 입력해주세요.",
    INVALID_EMAIL_FORMAT: "올바른 이메일 형식이 아닙니다.",
    PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
    // 이메일 미존재·비밀번호 불일치는 서버가 LOGIN_FAILED 하나로 통일해 내려준다.
    LOGIN_FAILED: "이메일 또는 비밀번호가 올바르지 않습니다.",
};

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const isActive = email && password && isValidEmail(email);

    async function handleLogin() {
        setEmailError("");
        setPasswordError("");

        let isValid = true;
        if (!email) {
            setEmailError("이메일을 입력해주세요.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            isValid = false;
        }
        if (!password) {
            setPasswordError("비밀번호를 입력해주세요.");
            isValid = false;
        }
        if (!isValid) return;

        try {
            const response = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                const message = ERROR_MAP[data.code] || "로그인에 실패했습니다.";
                // 이메일 관련 코드는 이메일 필드에, 그 외(비밀번호/로그인 실패)는 비밀번호 필드에 표시
                if (data.code === "EMAIL_REQUIRED" || data.code === "INVALID_EMAIL_FORMAT") {
                    setEmailError(message);
                } else {
                    setPasswordError(message);
                }
                return;
            }
            onLoginSuccess(data.data.accessToken);
        } catch (err) {
            console.error("요청 실패", err);
            setEmailError("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    return (
        <div>
            <h2>로그인</h2>
            <EmailField value={email} error={emailError} onChange={setEmail} />
            <PasswordField value={password} error={passwordError} onChange={setPassword} />
            <Button label="로그인" variant="primary" className={isActive ? "active" : ""} onClick={handleLogin} disabled={!isActive} />
        </div>
    );
}