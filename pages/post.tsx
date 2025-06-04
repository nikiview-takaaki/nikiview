import { useState } from "react";
import { savePost } from "../lib/firebase";

export default function PostPage() {
  const [diaryText, setDiaryText] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [review, setReview] = useState({
    item: "",
    place: "",
    price: "",
    rating: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      date: new Date().toISOString(), // 自動で日付挿入
      diaryText,
      isReview,
      review: isReview ? review : null,
    };

    try {
      await savePost(postData);
      alert("投稿が保存されました！");
      // 入力リセット
      setDiaryText("");
      setIsReview(false);
      setReview({
        item: "",
        place: "",
        price: "",
        rating: 3,
      });
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    }
  };

  return (
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
              style={{ width: "100%", marginBottom: "0.5rem" }}
              value={review.item}
              onChange={(e) =>
                setReview({ ...review, item: e.target.value })
              }
            />
            <input
              placeholder="購入場所（例：Amazon）"
              style={{ width: "100%", marginBottom: "0.5rem" }}
              value={review.place}
              onChange={(e) =>
                setReview({ ...review, place: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="金額（円）"
              style={{ width: "100%", marginBottom: "0.5rem" }}
              value={review.price}
              onChange={(e) =>
                setReview({ ...review, price: e.target.value })
              }
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
              />
              {review.rating}⭐️
            </label>
          </div>
        )}

        <button type="submit" style={{ marginTop: "1rem" }}>
          投稿する
        </button>
      </form>
    </div>
  );
}
