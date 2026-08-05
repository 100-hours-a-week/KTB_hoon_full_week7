import { useEffect, useRef, useState } from "react";

// 케밥(⋮) 버튼 + 드롭다운. items: [{ label, onClick, danger? }]
// 바깥을 클릭하면 닫힌다.
export default function KebabMenu({ items, ariaLabel = "메뉴" }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  function handleItemClick(e, onClick) {
    e.stopPropagation();
    setIsOpen(false);
    onClick();
  }

  return (
    <div className="kebab-menu" ref={ref}>
      <button
        className="kebab-btn"
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        ⋮
      </button>
      {isOpen && (
        <div className="kebab-dropdown">
          {items.map((item) => (
            <button
              key={item.label}
              className={`kebab-item${item.danger ? " danger" : ""}`}
              onClick={(e) => handleItemClick(e, item.onClick)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
