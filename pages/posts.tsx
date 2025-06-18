import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPublicPosts, deletePost, updatePost, Post } from "../lib/firebase";
import { getAuth } from "firebase/auth";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [uid, setUid] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      const data = await fetchPublicPosts();
      setPosts(data);
    } catch (error) {
      console.error("投稿の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    loadPosts();
    return () => unsubscribe();
  }, []);

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
        prev.map((post) => (post.id === id ? { ...post, diaryText: editText } : post))
      );
      setEditId(null);
    } catch (error) {
      alert("更新に失敗しました");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-lg mt-8">読み込み中...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">投稿一覧</h1>
        {posts.length === 0 && <p className="text-center text-gray-500">投稿がありません。</p>}
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 mb-6 shadow">
            {editId === post.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex space-x-4">
                  <button onClick={() => handleUpdate(post.id!)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                    保存
                  </button>
                  <button onClick={() => setEditId(null)} className="bg-gray-300 py-1 px-3 rounded hover:bg-gray-400">
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-1">{post.title || "（タイトルなし）"}</h2>
                <p className="mb-2">{post.diaryText}</p>
                {post.isReview && post.review && (
                  <div className="mb-2 text-sm text-gray-700">
                    <p><strong>レビュー対象:</strong> {post.review.item}</p>
                    <p><strong>場所:</strong> {post.review.place}</p>
                    <p><strong>価格:</strong> {post.review.price}円</p>
                    <p><strong>評価:</strong> {post.review.rating}⭐️</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  投稿日時: {post.createdAt?.toDate?.().toLocaleString?.() ?? "不明"}
                </p>

                {post.userId === uid && (
                  <div className="mt-4 flex space-x-4">
                    <button onClick={() => handleEdit(post.id!, post.diaryText)} className="bg-yellow-400 text-white py-1 px-3 rounded hover:bg-yellow-500">
                      編集
                    </button>
                    <button onClick={() => handleDelete(post.id!)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                      削除
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}