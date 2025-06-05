import Link from "next/link";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setCurrentDate(`${yyyy}/${mm}/${dd}`);
  }, []);

  return (
    <div>
      <header style={{ backgroundColor: "#f8f8f8", padding: "1rem", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link href="/">
            <strong>NikiView</strong>
          </Link>
        </div>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link href="/post">投稿</Link>
          <Link href="/reviews">レビュー</Link>
          <Link href="/diary">日記</Link>
        </nav>
        <div>{currentDate}</div>
      </header>
      <main style={{ padding: "1rem" }}>{children}</main>
    </div>
  );
}
