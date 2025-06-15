import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchAllUsers } from "../../lib/firebase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("ユーザ取得に失敗しました");
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
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>UID</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>ニックネーム</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.uid.slice(0, 8)}…
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.nickname || "(未登録)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
