const DEFAULT_IMAGE = "/images/default-profile.png";

export default function AuthorInfo({ nickname, imageUrl, date }) {
  return (
    <div className="post-author">
      <img className="author-img" src={imageUrl || DEFAULT_IMAGE} alt="작성자" />
      <span className="author-name">{nickname}</span>
      {date && <span className="post-date">{date}</span>}
    </div>
  );
}
