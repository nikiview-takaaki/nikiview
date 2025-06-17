import { useState } from "react";
import { auth, db } from "../lib/firebase"; // 既存のfirebase.tsをそのまま利用
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!agree) {
      setError("利用規約に同意してください");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestoreにプロフィール保存
      await setDoc(doc(db, "users", user.uid), {
        username,
        gender,
        ageGroup,
        email,
        createdAt: serverTimestamp(),
      });

      alert("登録が完了しました！");
      // ここでログイン後の画面へ遷移させてもOK

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h1>会員登録</h1>

      <input
        type="text"
        placeholder="ユーザーネーム"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">性別を選択</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="その他">その他</option>
        <option value="未回答">未回答</option>
      </select>

      <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
        <option value="">年代を選択</option>
        <option value="10代">10代</option>
        <option value="20代">20代</option>
        <option value="30代">30代</option>
        <option value="40代">40代</option>
        <option value="50代">50代</option>
        <option value="60代">60代</option>
        <option value="70代以上">70代以上</option>
        <option value="未回答">未回答</option>
      </select>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="パスワード（8文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />

      <label>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        利用規約に同意します
      </label>

      <button type="submit">登録</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
