import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDiaries } from "../lib/firebase";
import { Post } from "../lib/firebase";

export default function DiaryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadDiaries = async () => {
    try {
      const data = await fetchDiaries();
      const sorted = [...data].sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime?.() ?? 0;
        const bTime = b.createdAt?.toDate?.()?.getTime?.() ?? 0;
        return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
      });
      setPosts(sorted);
    } catch (error) {
      console.error("日記の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaries();
  }, [sortOrder]);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>日記一覧</h1>
          <div>
            <button onClick={() => setSortOrder("desc")}>新しい順</button>
            <button onClick={() => setSortOrder("asc")} style={{ marginLeft: "0.5rem" }}>古い順</button>
          </div>
        </div>
        {posts.length === 0 && <p>日記がありません。</p>}
        {posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <p>{post.diaryText}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              投稿日時: {post.createdAt?.toDate?.().toLocaleString?.() ?? "不明"}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
