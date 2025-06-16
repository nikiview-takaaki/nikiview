import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchAllUsers } from "../../lib/firebase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<{ id: string; nickname: string }[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const all = await fetchAllUsers();
      setUsers(all);
    };
    loadUsers();
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>ユーザ一覧（管理者用）</h1>
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
      </div>
    </Layout>
  );
}
