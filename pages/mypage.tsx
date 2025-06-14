import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchAllPosts, Post } from "../lib/firebase";  // 🔄ここ修正！
import { getAuth } from "firebase/auth";

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  const loadMyPosts = async (userId: string) => {
    try {
      const allPosts = await fetchAllPosts();  // 🔄ここも修正！
      const myPosts = allPosts.filter((post) => post.userId === userId);
      setPosts(myPosts);
    } catch (error) {
      console.error("マイ投稿の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        loadMyPosts(user.uid);
      } else {
        console.warn("未ログイン状態です");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#666" }}>
          {uid ? `あなたのマイページ（UID: ${uid.slice(0, 6)}…）` : "マイページ"}
        </h2>

        <h1>あなたの投稿一覧</h1>
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
