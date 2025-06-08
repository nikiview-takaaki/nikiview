import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPosts, deletePost, updatePost } from "../lib/firebase";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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

  const handleEdit = (id: string, currentText: string) => {
    setEditId(id);
    setEditText(currentText);
  };

  const handleUpdate = async (id: string) => {
    try {
      await updatePost(id, { diaryText: editText });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, diaryText: editText } : post
        )
      );
      setEditId(null);
    } catch (error) {
      alert("更新に失敗しました");
      console.error(error);
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
        {posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            {editId === post.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button onClick={() => handleUpdate(post.id)}>保存</button>
                <button onClick={() => setEditId(null)} style={{ marginLeft: "1rem" }}>キャンセル</button>
              </>
            ) : (
              <>
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
  投稿日時:{" "}
  {post.createdAt && post.createdAt.toDate
    ? post.createdAt.toDate().toLocaleString()
    : "不明"}
</p>

                <div style={{ marginTop: "1rem" }}>
                  <button onClick={() => handleEdit(post.id, post.diaryText)}>編集</button>
                  <button onClick={() => handleDelete(post.id)} style={{ marginLeft: "1rem" }}>削除</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
