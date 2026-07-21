import PostCard from "./PostCard";

// posts 배열을 순회하며 PostCard를 렌더링하는 책임만 담당
export default function PostList({ posts, onPostClick }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onClick={() => onPostClick(post.postId)}
        />
      ))}
    </div>
  );
}
