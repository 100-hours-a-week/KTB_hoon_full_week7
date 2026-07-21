// 에러/빈 목록 안내 문구. 빈 문자열이면 .list-message:empty 로 숨겨진다.
export default function ListMessage({ message }) {
  return <p className="list-message">{message}</p>;
}
