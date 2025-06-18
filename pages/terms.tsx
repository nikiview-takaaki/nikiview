// pages/terms.tsx

export default function TermsPage() {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">利用規約</h1>
        <p className="mb-2">
          このアプリをご利用いただくにあたり、以下の規約に同意いただく必要があります。
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>本サービスの内容は予告なく変更されることがあります。</li>
          <li>ユーザーの責任において投稿内容を管理してください。</li>
          <li>投稿内容に法令違反・誹謗中傷・公序良俗に反するものを含めないでください。</li>
          <li>運営が不適切と判断した投稿は削除することがあります。</li>
          <li>その他、詳細な規約は運営の判断に従って決定されます。</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">2025年6月 改定</p>
      </div>
    );
  }