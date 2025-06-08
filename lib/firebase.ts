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
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// 型定義
export interface Review {
  item: string;
  place: string;
  price: string;
  rating: number;
}

export interface Post {
  id: string;
  diaryText: string;
  isReview: boolean;
  review: Review | null;
  createdAt?: any;
  updatedAt?: any;
}

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

// 🔽 投稿を保存する関数（createdAt 付き）
export const savePost = async (postData: Omit<Post, "id">) => {
  try {
    await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Firestoreへの保存エラー:", error);
    throw error;
  }
};

// 🔽 投稿を取得する関数（新着順）
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  } catch (error) {
    console.error("Firestoreからの取得エラー:", error);
    throw error;
  }
};

// 🔽 投稿を削除する関数
export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "posts", id));
  } catch (error) {
    console.error("Firestoreの削除エラー:", error);
    throw error;
  }
};

// 🔽 投稿を更新する関数（編集用）
export const updatePost = async (id: string, newData: Partial<Post>) => {
  try {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      ...newData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Firestoreの更新エラー:", error);
    throw error;
  }
};

export { db, auth };
