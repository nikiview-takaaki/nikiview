import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 1rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>NikiView</h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          あなたの日記とレビューを記録・管理できるシンプルな匿名日記サービスです。
        </p>
      </div>
    </Layout>
  );
}
