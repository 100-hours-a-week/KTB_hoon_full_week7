// 모집글 관련 enum·라벨 (API 명세 §6.3~6.5)

export const CATEGORIES = [
  { value: "EXERCISE", label: "운동/스포츠", emoji: "🏀" },
  { value: "STUDY", label: "스터디", emoji: "📚" },
  { value: "HOBBY", label: "취미", emoji: "🎨" },
  { value: "GAME", label: "게임/오락", emoji: "🎮" },
  { value: "FOOD", label: "맛집/모임", emoji: "🍜" },
  { value: "VOLUNTEER", label: "봉사/나눔", emoji: "🤝" },
  { value: "ETC", label: "기타", emoji: "✨" },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export function categoryLabel(value) {
  return CATEGORY_MAP[value]?.label ?? value ?? "";
}

export function categoryEmoji(value) {
  return CATEGORY_MAP[value]?.emoji ?? "✨";
}

export const MEETING_TYPES = [
  { value: "ONLINE", label: "온라인" },
  { value: "OFFLINE", label: "오프라인" },
];

export function meetingLabel(value) {
  return value === "ONLINE" ? "온라인" : "오프라인";
}

export const RECRUIT_STATUS = {
  RECRUITING: "모집중",
  CLOSED: "모집완료",
};

export function recruitStatusLabel(value) {
  return RECRUIT_STATUS[value] ?? value ?? "";
}

// 모집글 생성/수정/발행 공통 에러 코드 → 한글 메시지 (API 명세 §3.4/§3.5)
export const RECRUIT_ERROR_MESSAGES = {
  TITLE_REQUIRED: "제목을 입력해주세요.",
  TITLE_LENGTH_EXCEEDED: "제목은 최대 30자까지 입력 가능합니다.",
  CONTENT_REQUIRED: "내용을 입력해주세요.",
  IMAGE_REQUIRED: "이미지를 선택해주세요.",
  POST_IMAGE_REQUIRED: "이미지를 등록해주세요.",
  CATEGORY_REQUIRED: "카테고리를 선택해주세요.",
  MEETING_TYPE_REQUIRED: "모임 방식을 선택해주세요.",
  ADDRESS_REQUIRED_FOR_OFFLINE: "오프라인 모임은 지역을 입력해야 합니다.",
  SIDO_REQUIRED: "시/도를 입력해주세요.",
  SIGUNGU_REQUIRED: "시/군/구를 입력해주세요.",
  EUPMYEONDONG_REQUIRED: "읍/면/동을 입력해주세요.",
  PLACE_NAME_REQUIRED: "장소명을 입력해주세요.",
  PLACE_NAME_LENGTH_EXCEEDED: "장소명은 최대 50자까지 입력 가능합니다.",
  CAPACITY_POSITIVE: "모집 인원은 1명 이상이어야 합니다.",
  POST_RATE_LIMIT_EXCEEDED:
    "모집글을 너무 자주 등록했습니다. 잠시 후 다시 시도해주세요.",
};

// 주소 객체 → 화면 표시용 문자열
export function formatAddress(address, placeName) {
  if (!address) return placeName || "";
  const parts = [address.sido, address.sigungu, address.eupmyeondong].filter(
    Boolean
  );
  const region = parts.join(" ");
  if (region && placeName) return `${region} · ${placeName}`;
  return region || placeName || "";
}

// 주소만(장소명 제외) 문자열로 합친다. 상세 위치(placeName)는 별도 표시용.
export function formatAddressOnly(address) {
  if (!address) return "";
  const parts = [
    address.sido,
    address.sigungu,
    address.eupmyeondong,
    address.detail,
  ].filter(Boolean);
  return parts.join(" ");
}
