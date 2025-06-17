import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { onAuthStateChanged, User } from "firebase/auth";

export const useAuthGuard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { user, loading };
};
