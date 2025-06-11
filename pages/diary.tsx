import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDiaries, Post } from "../lib/firebase";

export default function DiaryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadDiaries();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>公開日記一覧</h1>
        {posts.length === 0 && <p>公開日記がありません。</p>}
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
