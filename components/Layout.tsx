import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.error("匿名ログイン失敗", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("uid");
      setUser(null);
    } catch (err) {
      console.error("ログアウト失敗", err);
    }
  };

  return (
    <div>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/">ホーム</Link>
            <Link href="/post">投稿</Link>
            <Link href="/posts">一覧</Link>
            <Link href="/diary">日記</Link>
            <Link href="/reviews">レビュー</Link>
            <Link href="/mypage">マイページ</Link>
          </div>

          <div>
            {user ? (
              <button onClick={handleLogout}>ログアウト</button>
            ) : (
              <button onClick={handleLogin}>ログイン</button>
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
