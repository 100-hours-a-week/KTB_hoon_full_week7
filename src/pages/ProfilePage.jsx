import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import Button from "../components/Button";
import WithdrawModal from "../components/WithdrawModal";
import Toast from "../components/Toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  }

  async function handleWithdraw() {
    try {
      const response = await apiFetch("/profile", { method: "DELETE" });
      if (response.ok) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } catch (err) {
      console.error("회원 탈퇴 실패", err);
    }
  }

  return (
    <>
      <ProfileHeader />
      <main>
        <div className="container">
          <h2>회원정보수정</h2>

          <ProfileForm onUpdated={showToast} />

          <div className="withdraw-section">
            <Button
              label="회원 탈퇴"
              variant="link"
              className="btn-withdraw"
              onClick={() => setIsWithdrawModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onCancel={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
      />
      <Toast message={toastMessage} />
    </>
  );
}
