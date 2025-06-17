import Link from "next/link";
import Image from "next/image";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
    <header className="flex items-center justify-between p-4 shadow-md bg-gray-100 border-b">
      {/* 左ナビメニュー */}
      <nav className="flex items-center space-x-6 text-sm font-semibold">
        <Link href="/">ホーム</Link>
        <Link href="/posts">投稿一覧</Link>
        <Link href="/diary">日記一覧</Link>
        <Link href="/reviews">レビュー一覧</Link>
        <Link href="/post">投稿する</Link>
        {user && <Link href="/mypage">マイ投稿</Link>}
      </nav>

      {/* ロゴ中央 */}
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <Image src="/nikiview-logo.png" alt="NikiView" width={120} height={60} className="object-contain" />
        </Link>
      </div>

      {/* 右ユーザーメニュー */}
      <div className="flex items-center space-x-4 text-sm">
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
            ログアウト
          </button>
        ) : (
          <>
            <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">新規登録</Link>
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">ログイン</Link>
          </>
        )}
      </div>
    </header>
  );
}
