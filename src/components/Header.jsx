export default function Header({ title = "아무 말 대잔치", onBack }) {
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
