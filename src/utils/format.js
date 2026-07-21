// 1000 이상은 "1k" 형태로 축약
export function formatCount(num) {
  if (num >= 1000) return Math.floor(num / 1000) + "k";
  return num;
}

// "2026-06-26T10:30:00.123" → "2026-06-26 10:30:00"
export function formatDate(dateStr) {
  return dateStr.replace("T", " ").split(".")[0];
}
