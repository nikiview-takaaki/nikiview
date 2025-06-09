import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchReviews, Post } from "../lib/firebase";

export default function ReviewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const loadReviews = async () => {
    try {
      const data = await fetchReviews();
      setPosts(data);
    } catch (error) {
      console.error("レビューの取得に失敗しました", error);
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
    loadReviews();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>
          レビュー一覧
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
        {sortedPosts.length === 0 && <p>レビューがありません。</p>}
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
            {post.review && (
              <div style={{ marginTop: "0.5rem" }}>
                <p><strong>レビュー対象:</strong> {post.review.item}</p>
                <p><strong>場所:</strong> {post.review.place}</p>
                <p><strong>価格:</strong> {post.review.price}円</p>
                <p><strong>評価:</strong> {post.review.rating}⭐️</p>
              </div>
            )}
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              投稿日時: {formatDate(post.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
