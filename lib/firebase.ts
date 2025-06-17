import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
  where,
  setDoc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

signInAnonymously(auth).catch((error) => {
  console.error("匿名ログインに失敗:", error);
});

export type Review = {
  item: string;
  place: string;
  price: string;
  rating: number;
};

export type Post = {
  id?: string;
  diaryText: string;
  isReview: boolean;
  review?: Review | null;
  createdAt?: any;
  updatedAt?: any;
  userId?: string;
  isPublic?: boolean;
};

export const savePost = async (postData: Post) => {
  const user = auth.currentUser;
  if (!user) throw new Error("ユーザ未ログイン");

  await addDoc(collection(db, "posts"), {
    ...postData,
    isPublic: true,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });
};

export const fetchPublicPosts = async (): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("isPublic", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
};

export const fetchDiaries = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => !post.isReview);
};

export const fetchReviews = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => post.isReview);
};

export const fetchMyPosts = async (): Promise<Post[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
};

export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

export const updatePost = async (id: string, newData: Partial<Post>) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, { ...newData, updatedAt: serverTimestamp() });
};

export const saveUser = async (nickname: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("ユーザ未ログイン");

  await setDoc(doc(db, "users", user.uid), { nickname });
};

export const fetchAllUsers = async (): Promise<{ id: string; nickname: string }[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    nickname: (doc.data() as DocumentData).nickname ?? "(未登録)",
  }));
};

export const fetchNickname = async (uid: string): Promise<string | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return data.nickname || null;
  } else {
    return null;
  }
};

export { db, auth };
