import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchDiaries } from "../lib/firebase";
import { Post } from "../lib/firebase";

export default function DiaryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

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

  const toggleSortOrder = () => {
    setSortNewestFirst(!sortNewestFirst);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() ?? new Date(0);
    const dateB = b.createdAt?.toDate?.() ?? new Date(0);
    return sortNewestFirst
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });

  const formatDate = (createdAt: any): string => {
    try {
      const date = createdAt?.toDate?.();
      return date instanceof Date ? date.toLocaleString() : "不明";
    } catch {
      return "不明";
    }
  };

  useEffect(() => {
    loadDiaries();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>
          日記一覧
          <button
            onClick={toggleSortOrder}
            style={{
              marginLeft: "1rem",
              padding: "0.3rem 0.8rem",
              fontSize: "0.9rem"
            }}
          >
            {sortNewestFirst ? "新しい順" : "古い順"}
          </button>
        </h1>
        {sortedPosts.length === 0 && <p>日記がありません。</p>}
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <p>{post.diaryText}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              投稿日時: {formatDate(post.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
