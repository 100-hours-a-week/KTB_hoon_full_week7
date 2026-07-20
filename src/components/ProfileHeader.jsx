import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const DEFAULT_IMAGE = "/images/default-profile.png";

export default function ProfileHeader() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운이 열려 있을 때만 바깥 클릭 감지 → 아무 곳이나 누르면 닫힘
  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick() {
      setIsOpen(false);
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  function toggleDropdown(e) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  async function handleLogout() {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch (err) {
      console.error("로그아웃 실패", err);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }

  return (
    <header className="header">
      <span className="header-title">아무 말 대잔치</span>
      <div className="header-profile">
        <img
          className="profile-icon"
          src={DEFAULT_IMAGE}
          alt="프로필"
          onClick={toggleDropdown}
        />
        <div className={`dropdown${isOpen ? " show" : ""}`}>
          <button className="dropdown-item" onClick={() => navigate("/profile")}>
            회원정보수정
          </button>
          <button className="dropdown-item" onClick={() => navigate("/profile/password")}>
            비밀번호수정
          </button>
          <button className="dropdown-item" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
