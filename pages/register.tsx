import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { getAuth } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("ニックネームを入力してください");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("ユーザー情報が取得できません");

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { nickname });
      alert("登録しました！");
      router.push("/mypage");  // ✅ 登録後はマイページへ遷移
    } catch (error) {
      console.error("登録エラー:", error);
      alert("登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkRegistered = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        router.push("/mypage");  // ✅ 既に登録済みならマイページへ
      }
    };
    checkRegistered();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "2rem" }}>
        <h1>はじめまして！ニックネームを登録してください</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ニックネーム"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            maxLength={20}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "登録中..." : "登録する"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
