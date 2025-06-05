import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchPosts } from "../lib/firebase";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>投稿一覧</h1>
        {posts.length === 0 ? (
          <p>投稿がまだありません。</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p>{post.diaryText}</p>
              {post.isReview && post.review && (
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>レビュー：</strong>
                  <p>商品名: {post.review.item}</p>
                  <p>購入場所: {post.review.place}</p>
                  <p>価格: {post.review.price}円</p>
                  <p>評価: {post.review.rating}⭐️</p>
                </div>
              )}
              <small>
                投稿日時:{" "}
                {post.createdAt?.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                  : "日時不明"}
              </small>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
