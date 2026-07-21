import { useEffect } from "react";
// 모달이나 사이드바가 열렸을 때 배경 스크롤을 막고, 닫히면 원래 상태로 복구하는 커스텀 훅
// isOpen인 동안 배경 스크롤을 막고, 닫히거나 언마운트되면 원래대로 복구.
// document.body 조작을 이 훅 한 곳에 캡슐화해 재사용한다.
// ai 추천으로 추가해봄
export default function useScrollLock(isOpen) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);
}
