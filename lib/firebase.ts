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
  getDoc
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

// Firebase App 初期化
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// 匿名ログイン
async function ensureSignedIn() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
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
  await ensureSignedIn();
  await addDoc(collection(db, "posts"), {
    ...postData,
    userId: auth.currentUser?.uid,
    createdAt: serverTimestamp(),
  });
};

// 公開投稿取得
export const fetchPublicPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, "posts"), where("isPublic", "==", true), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
};

// 公開日記のみ
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

// 公開レビューのみ
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

// 自分の投稿のみ
export const fetchMyPosts = async (userId: string): Promise<Post[]> => {
  const q = query(collection(db, "posts"), where("userId", "==", userId), orderBy("createdAt", "desc"));
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
  await updateDoc(postRef, { ...newData, updatedAt: serverTimestamp() });
};

// UID取得（匿名ログイン保証付き）
export const getCurrentUserId = async (): Promise<string | null> => {
  await ensureSignedIn();
  return auth.currentUser?.uid ?? null;
};

// ニックネーム取得
export const fetchNickname = async (userId: string): Promise<string> => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data()?.nickname as string) : "未登録";
};
// 🔽 全ユーザ取得関数
export const fetchAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("ユーザ一覧の取得エラー:", error);
    throw error;
  }
};

export { db, auth };
