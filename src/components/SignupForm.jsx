import { useState } from "react";
import { apiFetch } from "../api";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import Button from "./Button";
import NicknameField from "./NicknameField";
import PasswordConfirmField from "./PasswordConfirmField";
import ProfileImageField from "./ProfileImageField";

const DEFAULT_IMAGE = "../images/default-profile.png";
const SIGNUP_ERROR_MAP = {
    EMAIL_REQUIRED: "이메일을 입력해주세요.",
    INVALID_EMAIL_FORMAT: "올바른 이메일 주소 형식을 입력해주세요.",
    PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
    INVALID_PASSWORD_FORMAT: "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.",
    PASSWORD_CONFIRM_REQUIRED: "비밀번호를 한번 더 입력해주세요.",
    PASSWORD_CONFIRM_MISMATCH: "비밀번호가 다릅니다.",
    NICKNAME_REQUIRED: "닉네임을 입력해주세요.",
    INVALID_NICKNAME_FORMAT: "닉네임은 최대 10글자까지 작성 가능합니다.",
    IMAGE_REQUIRED: "프로필 이미지를 선택해주세요.",
    EMAIL_DUPLICATED: "중복된 이메일입니다.",
    NICKNAME_DUPLICATED: "닉네임 중복입니다.",
};

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/.test(password);
}

function isValidNickname(nickname) {
    return /^[^\s]{1,10}$/.test(nickname);
}

export default function SignupForm({ onSignupSuccess }) {
    const [previewUrl, setPreviewUrl] = useState(DEFAULT_IMAGE);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [nickname, setNickname] = useState("");
    const [imageError, setImageError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [nicknameError, setNicknameError] = useState("");

    const isActive = email && password && passwordConfirm && nickname && isValidEmail(email) && isValidPassword(password) && isValidNickname(nickname) && password === passwordConfirm;
    function handleFileChange(file) {
        setPreviewUrl(URL.createObjectURL(file));
    }
    async function handleSignup() {
        setEmailError("");
        setPasswordError("");
        setPasswordConfirmError("");
        setNicknameError("");

        let isValid = true;

        if (!email) {
            setEmailError("이메일을 입력해주세요.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailError("올바른 이메일 주소 형식을 입력해주세요.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("비밀번호를 입력해주세요.");
            isValid = false;
        } else if (!isValidPassword(password)) {
            setPasswordError("비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.");
            isValid = false;
        }

        if (!passwordConfirm) {
            setPasswordConfirmError("비밀번호를 한번 더 입력해주세요.");
            isValid = false;
        } else if (password !== passwordConfirm) {
            setPasswordConfirmError("비밀번호가 다릅니다.");
            isValid = false;
        }

        if (!nickname) {
            setNicknameError("닉네임을 입력해주세요.");
            isValid = false;
        } else if (nickname.length > 10) {
            setNicknameError("닉네임은 최대 10글자까지 작성 가능합니다.");
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await apiFetch("/signup", {
                method: "POST",
                body: JSON.stringify({ email, nickname, password, passwordConfirm, imageUrl: DEFAULT_IMAGE }),
            });
            const data = await response.json();

            if (!response.ok) {
                const code = data.code;
                if (code === "EMAIL_DUPLICATED" || code === "EMAIL_REQUIRED" || code === "INVALID_EMAIL_FORMAT") {
                    setEmailError(SIGNUP_ERROR_MAP[code]);
                } else if (code === "NICKNAME_DUPLICATED" || code === "NICKNAME_REQUIRED" || code === "INVALID_NICKNAME_FORMAT") {
                    setNicknameError(SIGNUP_ERROR_MAP[code]);
                } else if (code === "PASSWORD_CONFIRM_MISMATCH" || code === "PASSWORD_CONFIRM_REQUIRED") {
                    setPasswordConfirmError(SIGNUP_ERROR_MAP[code]);
                } else if (code === "PASSWORD_REQUIRED" || code === "INVALID_PASSWORD_FORMAT") {
                    setPasswordError(SIGNUP_ERROR_MAP[code]);
                } else if (code === "IMAGE_REQUIRED") {
                    setImageError(SIGNUP_ERROR_MAP[code]);
                } else {
                    setEmailError(SIGNUP_ERROR_MAP[code] || "회원가입에 실패했습니다.");
                }
                return;
            }

            onSignupSuccess();
        } catch (err) {
            console.error("요청 실패", err);
            setEmailError("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    return (
        <div>
            <h2>회원가입</h2>
            <ProfileImageField previewUrl={previewUrl} onFileChange={handleFileChange} error={imageError} />
            <EmailField value={email} error={emailError} onChange={setEmail} />
            <PasswordField value={password} error={passwordError} onChange={setPassword} />
            <PasswordConfirmField value={passwordConfirm} error={passwordConfirmError} onChange={setPasswordConfirm} />
            <NicknameField value={nickname} error={nicknameError} onChange={setNickname} />
            <Button label="회원가입" variant="primary" className={isActive ? "active" : ""} onClick={handleSignup} disabled={!isActive} />
        </div>
    );

}