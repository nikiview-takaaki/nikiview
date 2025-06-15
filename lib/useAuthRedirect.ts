import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkNickname = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return; // 未ログインなら何もしない

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        router.push("/register");
      }
    };

    checkNickname();
  }, []);
};
