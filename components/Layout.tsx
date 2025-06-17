import { ReactNode } from "react";
import Header from "./Header"; // ここでHeaderを読み込む
import Link from "next/link";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>

      <footer className="flex justify-center items-center p-4 border-t bg-white">
        <Link href="/contact" className="text-blue-500 font-semibold hover:underline">
          お問い合わせ
        </Link>
      </footer>
    </div>
  );
}
