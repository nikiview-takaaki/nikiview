import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPosts } from "../lib/firebase";
import { Post } from "../lib/firebase";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error("投稿の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>投稿一覧</h1>
        {posts.length === 0 && <p>投稿がありません。</p>}
        {posts.map((post) => (
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
        ))}
      </div>
    </Layout>
  );
}
