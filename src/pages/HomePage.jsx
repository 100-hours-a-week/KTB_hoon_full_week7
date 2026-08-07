import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import ProductDemo from "../components/ProductDemo";

// 공개 랜딩 화면. 로그인 여부에 따라 CTA가 달라진다.
export default function HomePage() {
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("accessToken");

  return (
    <>
      <Header />
      <main className="home-main">
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-eyebrow">MEETUP PLATFORM</span>
            <h1 className="hero-title">
              같이 할 사람들을
              <br />
              지금 <em>만나다</em>
            </h1>
            <p className="hero-sub">
              운동 · 스터디 · 취미 · 맛집까지 — 관심사가 맞는 사람들을 모으고,
              마음에 드는 모임에 합류하세요.
            </p>

            <div className="hero-cta">
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
                    label="시작하기"
                    variant="primary"
                    className="active"
                    onClick={() => navigate("/signup")}
                  />
                  <button className="hero-ghost" onClick={() => navigate("/login")}>
                    로그인
                  </button>
                </>
              )}
            </div>

            <div className="hero-tags">
              <span className="hero-tag"># 운동/스포츠</span>
              <span className="hero-tag"># 스터디</span>
              <span className="hero-tag"># 취미</span>
              <span className="hero-tag"># 맛집/모임</span>
            </div>
          </div>

          <div className="hero-demo">
            <ProductDemo />
          </div>
        </section>
      </main>
    </>
  );
}
