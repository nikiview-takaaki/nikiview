// pages/diary.tsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDiaries } from "../lib/firebase";
import { Post } from "../lib/firebase";

export default function DiaryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const loadDiaries = async () => {
    try {
      const data = await fetchDiaries();
      setPosts(data);
    } catch (error) {
      console.error("日記の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = a.createdAt?.toDate?.().getTime?.() || 0;
    const timeB = b.createdAt?.toDate?.().getTime?.() || 0;
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  useEffect(() => {
    loadDiaries();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>日記一覧</h1>
          <button onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}>
            {sortOrder === "newest" ? "古い順に並べる" : "新しい順に戻す"}
          </button>
        </div>

        {sortedPosts.length === 0 && <p>日記がありません。</p>}
        {sortedPosts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <p>{post.diaryText}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              投稿日時: {post.createdAt?.toDate?.() instanceof Date
                ? post.createdAt.toDate().toLocaleString()
                : "不明"}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
