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
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

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

// 匿名ログイン & UID 永続化
export const initAuth = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        localStorage.setItem("myUid", user.uid);
        resolve(user);
      } else {
        const result = await signInAnonymously(auth);
        localStorage.setItem("myUid", result.user.uid);
        resolve(result.user);
      }
    });
  });
};

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

// 🔽 投稿を保存する関数（createdAt, userId 付き）
export const savePost = async (postData: Post) => {
  const user = auth.currentUser;
  if (!user) throw new Error("未ログインです");

  await addDoc(collection(db, "posts"), {
    ...postData,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });
};

// 🔽 全投稿取得（管理用、今は未使用）
export const fetchPosts = async (): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

// 🔽 公開投稿のみ取得
export const fetchPublicPosts = async (): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("isPublic", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

// 🔽 日記（公開のみ・レビュー以外）
export const fetchDiaries = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => !post.isReview);
};

// 🔽 レビュー（公開のみ・レビューのみ）
export const fetchReviews = async (): Promise<Post[]> => {
  const all = await fetchPublicPosts();
  return all.filter((post) => post.isReview);
};

// 🔽 マイ投稿のみ取得（マイページ用）
export const fetchMyPosts = async (uid: string): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

// 🔽 投稿削除
export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

// 🔽 投稿更新
export const updatePost = async (id: string, newData: Partial<Post>) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, {
    ...newData,
    updatedAt: serverTimestamp(),
  });
};

export { db, auth };
