import { Navigate } from "react-router-dom";

// 토큰이 없으면 로그인 화면으로, 있으면 자식 페이지를 렌더한다.
// login / signup / 홈(/) 은 이 가드를 두르지 않는 공개 라우트다.
export default function RequireAuth({ children }) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
