import ImagePreview from "./ImagePreview";
import HelperText from "./HelperText";

export default function ProfileImageField({ previewUrl, onFileChange, error }) {
  function handleChange(e) {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  }

  return (
    <div className="field">
      <label>프로필 사진</label>
      <label htmlFor="profileInput" className="profile-btn">
        <ImagePreview src={previewUrl} />
      </label>
      <input
        id="profileInput"
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <HelperText message={error} />
    </div>
  );
}