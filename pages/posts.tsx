import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPosts, deletePost } from "../lib/firebase";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error("投稿の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("本当にこの投稿を削除しますか？")) {
      try {
        await deletePost(id);
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } catch (error) {
        alert("削除に失敗しました");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <Layout><p>読み込み中...</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>投稿一覧</h1>
        {posts.length === 0 && <p>投稿がありません。</p>}
        {posts.map((post) => {
          const createdAt = post.createdAt?.toDate
            ? post.createdAt.toDate().toLocaleString()
            : "日時不明";
  
          return (
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
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                投稿日時: {createdAt}
              </p>
              <div style={{ marginTop: "1rem" }}>
                <button onClick={() => handleDelete(post.id)}>削除</button>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
  
}
