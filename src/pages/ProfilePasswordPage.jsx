import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import ProfilePasswordForm from "../components/ProfilePasswordForm";
import Toast from "../components/Toast";

export default function ProfilePasswordPage() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  function handleUpdated(message) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
      navigate("/profile");
    }, 2000);
  }

  return (
    <>
      <ProfileHeader />
      <main>
        <div className="container">
          <h2>비밀번호 수정</h2>
          <ProfilePasswordForm onUpdated={handleUpdated} />
        </div>
      </main>
      <Toast message={toastMessage} />
    </>
  );
}
