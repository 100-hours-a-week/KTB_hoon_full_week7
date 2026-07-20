import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignupForm from "../components/SignupForm";
import Button from "../components/Button";

export default function SignupPage() {
  const navigate = useNavigate();

  function handleSignupSuccess() {
    navigate("/login");
  }

  return (
    <>
      <Header title="아무 말 대잔치" onBack={() => navigate("/login")} />
      <main>
        <div className="login-form">
          <SignupForm onSignupSuccess={handleSignupSuccess} />
          <Button label="로그인하러가기" variant="link" onClick={() => navigate("/login")} />
        </div>
      </main>
    </>
  );
}