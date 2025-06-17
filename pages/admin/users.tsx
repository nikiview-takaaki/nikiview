import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchAllUsers } from "../../lib/firebase";

type UserData = {
  id: string;
  nickname: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("ユーザ一覧の取得に失敗しました", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>ユーザ一覧（管理者用）</h1>
        {loading ? (
          <p>読み込み中...</p>
        ) : users.length === 0 ? (
          <p>ユーザが登録されていません。</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>UID</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>ニックネーム</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{user.id}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{user.nickname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
