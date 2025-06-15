// pages/mypage.tsx

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchMyPosts, Post, db, auth } from "../lib/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getDoc, doc } from "firebase/firestore";

export default function MyPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const loadMyPosts = async () => {
    try {
      const data = await fetchMyPosts();
      setPosts(data);
    } catch (error) {
      console.error("投稿の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNickname = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setNickname(docSnap.data().nickname);
    }
  };

  useEffect(() => {
    loadNickname();
    loadMyPosts();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#666" }}>
          {nickname ? `${nickname}さんのマイページ` : "マイページ"}
        </h2>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* 左: カレンダー */}
          <div style={{ flex: 1 }}>
            <h3>カレンダー</h3>
            <Calendar
              value={selectedDate}
              onChange={(date) => setSelectedDate(date as Date)}
            />
          </div>

          {/* 右: 投稿一覧 */}
          <div style={{ flex: 2 }}>
            <h3>あなたの投稿一覧</h3>
            {loading ? (
              <p>読み込み中...</p>
            ) : posts.length === 0 ? (
              <p>投稿がありません。</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}
                >
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
                  <p>公開: {post.isPublic ? "公開" : "非公開"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
