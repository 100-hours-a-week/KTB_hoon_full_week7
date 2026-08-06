export default function Header({ title = "모집 게시판", onBack }) {
  return (
    <header className="title-bar">
      <div className="nav-inner">
        {onBack && (
          <button className="btn-back" onClick={onBack} aria-label="뒤로가기">
            ‹
          </button>
        )}
        <span className="brand">{title}</span>
      </div>
    </header>
  );
}
