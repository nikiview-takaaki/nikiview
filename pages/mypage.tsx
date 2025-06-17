import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchMyPosts, fetchNickname, Post, auth } from "../lib/firebase";  // authもimport

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState<string>("");

  const loadMyData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("ユーザ未ログイン");

      const name = await fetchNickname(user.uid);  // ✅ uidを渡す
      setNickname(name ?? "(ニックネーム未登録)");

      const myPosts = await fetchMyPosts();
      setPosts(myPosts);
    } catch (error) {
      console.error("マイデータ取得エラー", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyData();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#666" }}>
          {nickname} さんのマイページ
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
