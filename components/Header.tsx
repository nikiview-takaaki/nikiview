import Link from "next/link";
import { auth } from "../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "#222",
      color: "#fff"
    }}>
      <h1 style={{ fontSize: "1.5rem" }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>NikiView</Link>
      </h1>

      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link href="/posts" style={{ color: "#fff" }}>投稿一覧</Link>
        <Link href="/diary" style={{ color: "#fff" }}>日記一覧</Link>
        <Link href="/reviews" style={{ color: "#fff" }}>レビュー一覧</Link>

        {user ? (
          <>
            <Link href="/post" style={{ color: "#fff" }}>投稿</Link>
            <Link href="/mypage" style={{ color: "#fff" }}>マイページ</Link>
            <button onClick={handleLogout} style={{ background: "#555", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "#fff" }}>ログイン</Link>
            <Link href="/signup" style={{ color: "#fff" }}>新規登録</Link>
          </>
        )}
      </nav>
    </header>
  );
}
