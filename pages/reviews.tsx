import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPosts, Post } from "../lib/firebase";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const allPosts = await fetchPosts();
      const reviewPosts = allPosts.filter((post) => post.isReview);
      setReviews(reviewPosts);
    } catch (error) {
      console.error("レビューの取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>レビュー一覧</h1>
        {reviews.length === 0 && <p>レビューがありません。</p>}
        {reviews.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <p>{post.diaryText}</p>
            {post.review && (
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
        ))}
      </div>
    </Layout>
  );
}
