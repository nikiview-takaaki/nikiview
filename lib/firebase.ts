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

// Firebase Config（環境変数から取得）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase App 初期化（重複防止）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// 匿名ログイン（未ログイン時のみ）
signInAnonymously(auth).catch((error) => {
  console.error("匿名ログインに失敗:", error);
});

// 型定義
export type Review = {
  item: string;
  place: string;
  price: string;
  rating: number;
};

export type Post = {
  id?: string;
  title: string;  // ← ⭐️追加
  diaryText: string;
  isReview: boolean;
  review?: Review | null;
  createdAt?: any;
  updatedAt?: any;
  userId?: string;
  isPublic?: boolean;
};

// 投稿を保存（✅ isPublic: true を自動付与版）
export const savePost = async (postData: Post) => {
  const user = auth.currentUser;
  if (!user) throw new Error("ユーザ未ログイン");

  await addDoc(collection(db, "posts"), {
  title: postData.title,
  diaryText: postData.diaryText,
  isReview: postData.isReview,
  review: postData.review ?? null,
  isPublic: postData.isPublic, // ✅ 修正
  userId: user.uid,
  createdAt: serverTimestamp(),
});
};

// 投稿取得（公開のみ）
export const fetchPublicPosts = async (): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("isPublic", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
};

// 日記のみ取得（公開のみ）
export const fetchDiaries = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => !post.isReview);
};

// レビューのみ取得（公開のみ）
export const fetchReviews = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => post.isReview);
};

// 自分の投稿のみ取得
export const fetchMyPosts = async (): Promise<Post[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
};

// 投稿削除
export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

// 投稿更新
export const updatePost = async (id: string, newData: Partial<Post>) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, { ...newData, updatedAt: serverTimestamp() });
};

// ユーザ登録 (ニックネーム保存用)
export const saveUser = async (nickname: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("ユーザ未ログイン");

  await setDoc(doc(db, "users", user.uid), { nickname });
};

// 全ユーザ取得（管理者用）
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
