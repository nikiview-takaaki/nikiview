import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // ニックネーム確認
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setNickname(docSnap.data().nickname);
        } else {
          setNickname(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getFullYear()}/${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")} ${now
          .getHours()
          .toString()
          .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
    setNickname(null);
  };

  return (
    <div>
      <header
        style={{
          background: "#f2f2f2",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 左側メニュー */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/">ホーム</Link>
          {user && (
            <>
              <Link href="/post">投稿</Link>
              <Link href="/posts">一覧</Link>
              <Link href="/diary">日記</Link>
              <Link href="/reviews">レビュー</Link>
              <Link href="/mypage">マイページ</Link>
            </>
          )}
          {!user && (
            <>
              <Link href="/posts">一覧</Link>
              <Link href="/diary">日記</Link>
              <Link href="/reviews">レビュー</Link>
            </>
          )}
        </div>

        {/* 中央ロゴ */}
        <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
          <Link href="/">Niki View</Link>
        </div>

        {/* 右側 */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>{currentTime}</span>
          {user ? (
            <button onClick={handleLogout}>ログアウト</button>
          ) : (
            <>
              <Link href="/register">新規登録</Link>
              <Link href="/mypage">ログイン</Link>
            </>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
