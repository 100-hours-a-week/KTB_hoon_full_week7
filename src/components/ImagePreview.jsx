export default function ImagePreview({ src }) {
  return (
    <div className="image-preview">
      <img src={src} alt="프로필 미리보기" />
    </div>
  );
}