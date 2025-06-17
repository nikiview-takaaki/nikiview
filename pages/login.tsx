import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("ログイン成功！");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h1>ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">ログイン</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
