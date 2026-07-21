export default function Header({ title = "문의사항 게시판", onBack }) {
  return (
    <header className="title-bar">
      {onBack && (
        <button className="btn-back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
      )}
      <span>{title}</span>
    </header>
  );
}
