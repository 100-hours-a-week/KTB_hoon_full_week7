import { SIDO_LIST, SIGUNGU_BY_SIDO } from "../constants/regions";

// 시/도 → 시/군/구 연동 드롭다운. 시/도를 바꾸면 시/군/구는 초기화된다.
// includeAll=true 면 검색 필터용으로 "전체" 옵션을 노출한다.
export default function RegionSelect({
  sido,
  sigungu,
  onSidoChange,
  onSigunguChange,
  includeAll = false,
}) {
  const sigunguOptions = SIGUNGU_BY_SIDO[sido] || [];

  return (
    <div className="region-select">
      <select
        className="region-dropdown"
        value={sido}
        onChange={(e) => {
          onSidoChange(e.target.value);
          onSigunguChange(""); // 시/도가 바뀌면 시/군/구 리셋
        }}
      >
        <option value="">{includeAll ? "시/도 전체" : "시/도 선택"}</option>
        {SIDO_LIST.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className="region-dropdown"
        value={sigungu}
        onChange={(e) => onSigunguChange(e.target.value)}
        disabled={!sido}
      >
        <option value="">{includeAll ? "시/군/구 전체" : "시/군/구 선택"}</option>
        {sigunguOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
