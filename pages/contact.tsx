import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
      <p className="mb-4">ご質問・ご要望などがございましたら、以下のフォームよりご連絡ください。</p>

      <form className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">お名前 (任意)</label>
          <input type="text" className="w-full border rounded p-2" placeholder="お名前を入力" />
        </div>

        <div>
          <label className="block font-semibold mb-1">メールアドレス (任意)</label>
          <input type="email" className="w-full border rounded p-2" placeholder="your@email.com" />
        </div>

        <div>
          <label className="block font-semibold mb-1">お問い合わせ内容</label>
          <textarea className="w-full border rounded p-2 h-32" placeholder="お問い合わせ内容をご記入ください" required />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          送信
        </button>
      </form>
    </Layout>
  );
}
