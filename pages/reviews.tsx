import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPublicPosts, Post } from "../lib/firebase";

export default function ReviewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const allPosts = await fetchPublicPosts();
        const reviews = allPosts.filter((post) => post.isReview);
        setPosts(reviews);
      } catch (error) {
        console.error("レビューの取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>レビュー一覧</h1>
        {loading ? <p>読み込み中...</p> : (
          posts.length === 0 ? <p>レビューがありません。</p> : posts.map((post) => (
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
          ))
        )}
      </div>
    </Layout>
  );
}
