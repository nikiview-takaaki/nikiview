// lib/firebase.ts
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
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Firebase Config
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

// 匿名ログイン
if (!auth.currentUser) {
  signInAnonymously(auth).catch((error) => {
    console.error("匿名ログインに失敗:", error);
  });
}

// 型定義
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
  isPublic: boolean;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
};

// 投稿保存
export const savePost = async (postData: Post) => {
  const userId = auth.currentUser?.uid;
  try {
    await addDoc(collection(db, "posts"), {
      ...postData,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("保存エラー:", error);
    throw error;
  }
};

// 投稿取得（全体公開）
export const fetchPublicPosts = async (): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, "posts"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
  } catch (error) {
    console.error("取得エラー:", error);
    throw error;
  }
};

// 日記のみ取得
export const fetchDiaries = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => !post.isReview);
};

// レビューのみ取得
export const fetchReviews = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => post.isReview);
};

// 自分の投稿を取得
export const fetchMyPosts = async (uid: string): Promise<Post[]> => {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 削除
export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

// 更新
export const updatePost = async (id: string, newData: Partial<Post>) => {
  await updateDoc(doc(db, "posts", id), {
    ...newData,
    updatedAt: serverTimestamp(),
  });
};

export { db, auth };
