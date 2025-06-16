import { Post } from "../lib/firebase";

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
  return (
    <div>
      {posts.length === 0 ? (
        <p>投稿がありません。</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <p>{post.diaryText}</p>
            {post.isReview && post.review && (
              <div>
                <p><strong>レビュー対象:</strong> {post.review.item}</p>
                <p><strong>場所:</strong> {post.review.place}</p>
                <p><strong>価格:</strong> {post.review.price}円</p>
                <p><strong>評価:</strong> {post.review.rating}⭐️</p>
              </div>
            )}
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              投稿日時: {post.createdAt?.toDate?.().toLocaleString?.() ?? "不明"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
