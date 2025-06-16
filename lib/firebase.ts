// lib/firebase.ts

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
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

// 匿名ログイン（永続UID管理）
export const signInWithPersistence = async () => {
  const localUid = localStorage.getItem("anonymousUid");
  if (localUid) {
    return localUid;
  }
  const result = await signInAnonymously(auth);
  const uid = result.user.uid;
  localStorage.setItem("anonymousUid", uid);
  return uid;
};

// 現在のユーザーID取得（localStorage優先）
export const getCurrentUserId = (): string | null => {
  return localStorage.getItem("anonymousUid") || auth.currentUser?.uid || null;
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
  createdAt?: any;
  updatedAt?: any;
  isPublic: boolean;
  userId?: string;
};

// 🔽 投稿を保存
export const savePost = async (postData: Post) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("ユーザーIDが取得できません");

  await addDoc(collection(db, "posts"), {
    ...postData,
    userId,
    createdAt: serverTimestamp(),
  });
};

// 🔽 公開投稿の取得（全ユーザー用）
export const fetchPublicPosts = async (): Promise<Post[]> => {
  const q = query(
    collection(db, "posts"),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 🔽 マイ投稿取得
export const fetchMyPosts = async (): Promise<Post[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 🔽 日記のみ取得（公開のみ）
export const fetchDiaries = async (): Promise<Post[]> => {
  const q = query(
    collection(db, "posts"),
    where("isReview", "==", false),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 🔽 レビューのみ取得（公開のみ）
export const fetchReviews = async (): Promise<Post[]> => {
  const q = query(
    collection(db, "posts"),
    where("isReview", "==", true),
    where("isPublic", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 🔽 投稿の削除
export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

// 🔽 投稿の更新
export const updatePost = async (id: string, newData: Partial<Post>) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, {
    ...newData,
    updatedAt: serverTimestamp(),
  });
};

// 🔽 ユーザ管理系
export const fetchAllUsers = async (): Promise<{ id: string; nickname: string }[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    nickname: (doc.data() as any).nickname ?? "(未登録)",
  }));
};

export const fetchNickname = async (userId: string): Promise<string | null> => {
  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as any).nickname : null;
};

export { db, auth };
