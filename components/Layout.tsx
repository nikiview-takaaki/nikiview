import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now
          .getDate()
          .toString()
          .padStart(2, "0")} ${now
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
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 shadow-md bg-gray-100 border-b">
        {/* 左側メニュー */}
        <nav className="flex items-center space-x-6">
          <Link href="/">ホーム</Link>
          <Link href="/posts">投稿一覧</Link>
          <Link href="/diary">日記一覧</Link>
          <Link href="/reviews">レビュー一覧</Link>
          <Link href="/post">投稿する</Link> {/* 新規投稿追加 */}
          {user && <Link href="/mypage">マイ投稿</Link>}
        </nav>

        {/* 中央ロゴ */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <Image src="/nikiview-logo.png" alt="NikiView" width={120} height={60} className="object-contain" />
          </Link>
        </div>

        {/* 右側 */}
        <div className="flex items-center space-x-4">
          <span>{currentTime}</span>
          {user ? (
            <button onClick={handleLogout}>ログアウト</button>
          ) : (
            <>
              <Link href="/register">新規登録</Link>
              <Link href="/login">ログイン</Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 p-4">{children}</main>

      <footer className="flex justify-center items-center p-4 border-t">
        <Link href="/contact" className="text-blue-500">
          お問い合わせ
        </Link>
      </footer>
    </div>
  );
}
