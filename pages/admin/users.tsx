import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchAllUsers } from "../../lib/firebase";  // ✅ ここで読み込み

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("ユーザ一覧の取得失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>ユーザ一覧（管理者用）</h1>
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.uid}>
                UID: {user.uid} / ニックネーム: {user.nickname ?? "未登録"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
