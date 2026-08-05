import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";

// 공개 랜딩 화면. 로그인 여부에 따라 진입 버튼이 달라진다.
export default function HomePage() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("accessToken");

  return (
    <>
      <Header />
      <main>
        <div className="login-form home-card">
          <p className="intro">
            안녕하세요,
            <br />
            함께할 팀원을 찾는 <strong>모집 게시판</strong> 입니다.
          </p>

          {isAuthed ? (
            <Button
              label="모집글 보러가기"
              variant="primary"
              className="active"
              onClick={() => navigate("/posts")}
            />
          ) : (
            <>
              <Button
                label="로그인"
                variant="primary"
                className="active"
                onClick={() => navigate("/login")}
              />
              <Button
                label="회원가입"
                variant="link"
                onClick={() => navigate("/signup")}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
}
