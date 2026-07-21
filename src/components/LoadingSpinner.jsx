// 무한 스크롤 로딩 표시 겸 IntersectionObserver 감지 대상(sentinel).
// display:none이면 관찰이 안 되므로 항상 렌더하고, 텍스트만 로딩 중에 표시한다.
// (React 19에서는 ref를 일반 prop으로 받을 수 있다)
export default function LoadingSpinner({ visible, ref }) {
  return (
    <div ref={ref} className="loading">
      {visible ? "불러오는 중..." : ""}
    </div>
  );
}
