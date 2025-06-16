import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
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
  diaryText: string;
  isReview: boolean;
  review?: Review | null;
  isPublic: boolean;
  createdAt?: any;
  updatedAt?: any;
  userId?: string;
};

// 投稿保存
export const savePost = async (postData: Post) => {
  const user = auth.currentUser;
  await addDoc(collection(db, "posts"), {
    ...postData,
    userId: user?.uid,
    createdAt: serverTimestamp(),
  });
};

// 公開投稿取得
export const fetchPublicPosts = async (): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("isPublic", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 日記取得（公開のみ）
export const fetchDiaries = async (): Promise<Post[]> => {
  const posts = await fetchPublicPosts();
  return posts.filter((post) => !post.isReview);
};

// レビュー取得（公開のみ）
export const fetchReviews = async (): Promise<Post[]> => {
  const posts = await fetchPublicPosts();
  return posts.filter((post) => post.isReview);
};

// 自分の投稿を取得
export const fetchMyPosts = async (userId: string): Promise<Post[]> => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 投稿削除
export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

// 投稿更新
export const updatePost = async (id: string, newData: Partial<Post>) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, {
    ...newData,
    updatedAt: serverTimestamp(),
  });
};

// UID取得
export const getCurrentUserId = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) return user.uid;
  return null;
};

// ニックネーム取得
export const fetchNickname = async (userId: string): Promise<string | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().nickname || null;
  }
  return null;
};

export { db, auth };
