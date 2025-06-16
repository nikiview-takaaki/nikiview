import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Post, fetchMyPosts, fetchNickname, getCurrentUserId } from "../lib/firebase";
import MyCalendar from "../components/MyCalendar";

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = getCurrentUserId();
      if (!userId) {
        setLoading(false);
        return;
      }
      const nickname = await fetchNickname(userId);
      setNickname(nickname);
      const myPosts = await fetchMyPosts();
      setPosts(myPosts);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#666" }}>
          {nickname ? `${nickname}さんのマイページ` : "マイページ"}
        </h2>

        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ flex: 1 }}>
            <h3>カレンダー</h3>
            <MyCalendar />
          </div>

          <div style={{ flex: 2 }}>
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
        </div>
      </div>
    </Layout>
  );
}
