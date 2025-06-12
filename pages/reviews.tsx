import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchReviews, Post } from "../lib/firebase";

export default function ReviewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchReviews();
      setPosts(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>レビュー一覧</h1>
        {loading ? <p>読み込み中...</p> : posts.length === 0 ? <p>レビューがありません。</p> :
          posts.map((post) => (
            <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <p>{post.diaryText}</p>
              {post.review && (
                <div>
                  <p>対象: {post.review.item}</p>
                  <p>場所: {post.review.place}</p>
                  <p>価格: {post.review.price}円</p>
                  <p>評価: {post.review.rating}⭐️</p>
                </div>
              )}
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                投稿日時: {post.createdAt?.toDate?.().toLocaleString?.() ?? "不明"}
              </p>
            </div>
          ))
        }
      </div>
    </Layout>
  );
}
