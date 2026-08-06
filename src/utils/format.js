// 1000 이상은 "1k" 형태로 축약
export function formatCount(num) {
  if (num == null) return 0;
  if (num >= 1000) return Math.floor(num / 1000) + "k";
  return num;
}

// "2026-06-26T10:30:00.123" → "2026-06-26 10:30:00"
// createdAt이 null일 수 있으므로 방어적으로 처리한다.
export function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.replace("T", " ").split(".")[0];
}
