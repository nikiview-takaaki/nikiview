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
  where
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
  isPublic: boolean;  // ✅ 公開・非公開
  userId?: string;     // ✅ 投稿者のUID
  createdAt?: any;
  updatedAt?: any;
};

// 🔽 投稿を保存する関数（createdAt・userId 付き）
export const savePost = async (postData: Post) => {
  try {
    await addDoc(collection(db, "posts"), {
      ...postData,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Firestoreへの保存エラー:", error);
    throw error;
  }
};

// 🔽 全投稿取得（公開のみ）
export const fetchPublicPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("isPublic", "==", true), orderBy("createdAt", "desc"));
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

// 🔽 日記のみ（公開のみ）
export const fetchDiaries = async (): Promise<Post[]> => {
  const posts = await fetchPublicPosts();
  return posts.filter((post) => !post.isReview);
};

// 🔽 レビューのみ（公開のみ）
export const fetchReviews = async (): Promise<Post[]> => {
  const posts = await fetchPublicPosts();
  return posts.filter((post) => post.isReview);
};

// 🔽 自分の投稿のみ取得（UID指定）
export const fetchMyPosts = async (uid: string): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", uid), orderBy("createdAt", "desc"));
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

// 🔽 投稿削除
export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "posts", id));
  } catch (error) {
    console.error("Firestoreの削除エラー:", error);
    throw error;
  }
};

// 🔽 投稿更新
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
