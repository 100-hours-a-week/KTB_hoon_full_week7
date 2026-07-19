import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import Button from "../components/Button";

export default function LoginPage() {
    const navigate = useNavigate();
    function handleLoginSuccess(accessToken) {
        localStorage.setItem("accessToken", accessToken);
        navigate("/posts");
    }
    return (
        <>
            <Header />
            <main>
                <div className="login-form">
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                    <Button label="회원가입" variant="register" onClick={() => navigate("/signup")} />
                </div>
            </main>
        </>
    );
}