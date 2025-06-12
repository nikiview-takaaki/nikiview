import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchMyPosts, Post } from "../lib/firebase";
import { getAuth } from "firebase/auth";

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        const data = await fetchMyPosts(user.uid);
        setPosts(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#666" }}>
          {uid ? `あなたのマイページ（UID: ${uid.slice(0, 6)}…）` : "マイページ"}
        </h2>
        <h3>あなたの投稿一覧</h3>
        {loading ? (
          <p>読み込み中...</p>
        ) : posts.length === 0 ? (
          <p>投稿がありません。</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <p>{post.diaryText}</p>
              {post.isReview && post.review && (
                <div>
                  <p>レビュー: {post.review.item} / {post.review.place} / {post.review.price}円 / {post.review.rating}⭐️</p>
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
