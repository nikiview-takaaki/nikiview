import { useEffect } from "react";
import Layout from "../components/Layout";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInAnonymously(auth);
      router.push("/");
    } catch (error) {
      console.error("ログイン失敗:", error);
      alert("ログインに失敗しました");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-6">ログイン</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600"
        >
          匿名でログイン
        </button>
      </div>
    </Layout>
  );
}
