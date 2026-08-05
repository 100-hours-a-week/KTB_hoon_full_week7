import './App.css'
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProfilePasswordPage from './pages/ProfilePasswordPage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import PostEditPage from './pages/PostEditPage';
import RequireAuth from './components/RequireAuth';

function App() {
  const navigate = useNavigate();

  // api.js가 INVALID_TOKEN을 감지하면 로그인 화면으로 이동시킨다.
  useEffect(() => {
    function handleInvalidToken() {
      navigate("/login", { replace: true });
    }
    window.addEventListener("auth:invalid-token", handleInvalidToken);
    return () => window.removeEventListener("auth:invalid-token", handleInvalidToken);
  }, [navigate]);

  return (
    <Routes>
      {/* 공개 라우트: 홈 / 로그인 / 회원가입 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 인증 필요 라우트 */}
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/profile/password" element={<RequireAuth><ProfilePasswordPage /></RequireAuth>} />
      <Route path="/posts" element={<RequireAuth><PostsPage /></RequireAuth>} />
      <Route path="/posts/:postId" element={<RequireAuth><PostDetailPage /></RequireAuth>} />
      <Route path="/post-write" element={<RequireAuth><PostWritePage /></RequireAuth>} />
      <Route path="/post-edit" element={<RequireAuth><PostEditPage /></RequireAuth>} />

      {/* 알 수 없는 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
