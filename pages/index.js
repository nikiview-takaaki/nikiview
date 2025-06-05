import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>ようこそ、NikiViewへ！</h1>
        <p>あなたの買ってよかった日記を残しましょう。</p>

        <div style={{ marginTop: "2rem" }}>
          <Link href="/post">
            <button style={{ margin: "0.5rem" }}>日記を投稿</button>
          </Link>
          <Link href="/posts">
            <button style={{ margin: "0.5rem" }}>投稿一覧を見る</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
