import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return { logout };
};
