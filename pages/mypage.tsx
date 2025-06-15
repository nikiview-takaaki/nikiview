import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchMyPosts } from "../lib/firebase";
import { getAuth } from "firebase/auth";
import { Post } from "../lib/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const loadMyPosts = async (userId: string) => {
    try {
      const myPosts = await fetchMyPosts(userId);
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
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#666" }}>
          {uid ? `あなたのマイページ（UID: ${uid.slice(0, 6)}…）` : "マイページ"}
        </h2>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* 左側: カレンダー */}
          <div style={{ flex: 1 }}>
            <h3>カレンダー</h3>
            <Calendar
              value={selectedDate}
              onChange={(date) => setSelectedDate(date as Date)}
            />
          </div>

          {/* 右側: 投稿一覧 */}
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
