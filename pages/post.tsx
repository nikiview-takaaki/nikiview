import { useState } from "react";
import Layout from "../components/Layout";
import { savePost, Post, Review, auth } from "../lib/firebase";

export default function PostPage() {
  const [diaryText, setDiaryText] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [review, setReview] = useState<Review>({
    item: "",
    place: "",
    price: "",
    rating: 3,
  });
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("ログインしてください");
      return;
    }

    const postData: Post = {
      diaryText,
      isReview,
      review: isReview ? review : null,
      isPublic,
    };

    await savePost(postData);
    alert("投稿が保存されました！");
    setDiaryText("");
    setIsReview(false);
    setReview({ item: "", place: "", price: "", rating: 3 });
    setIsPublic(true);
  };

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>日記を投稿</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={8}
            style={{ width: "100%", marginBottom: "1rem" }}
            placeholder="今日の出来事を書いてください..."
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={isReview}
              onChange={(e) => setIsReview(e.target.checked)}
            />
            レビューも書く
          </label>

          {isReview && (
            <div style={{ marginTop: "1rem" }}>
              <input
                placeholder="商品・サービス名"
                value={review.item}
                style={{ width: "100%", marginBottom: "0.5rem" }}
                onChange={(e) => setReview({ ...review, item: e.target.value })}
              />
              <input
                placeholder="購入場所"
                value={review.place}
                style={{ width: "100%", marginBottom: "0.5rem" }}
                onChange={(e) => setReview({ ...review, place: e.target.value })}
              />
              <input
                type="number"
                placeholder="金額（円）"
                value={review.price}
                style={{ width: "100%", marginBottom: "0.5rem" }}
                onChange={(e) => setReview({ ...review, price: e.target.value })}
              />
              <label>
                評価（1〜5）:{" "}
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={review.rating}
                  onChange={(e) =>
                    setReview({ ...review, rating: Number(e.target.value) })
                  }
                />{" "}
                {review.rating}⭐️
              </label>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              公開する
            </label>
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>
            投稿する
          </button>
        </form>
      </div>
    </Layout>
  );
}
