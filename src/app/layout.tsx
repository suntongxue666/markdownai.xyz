import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"; // For toasts
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
// 不再需要导入 Image 组件，因为它现在是普通的 img 标签
// import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarkDownAI - AI Powered PDF to Markdown Converter",
  description: "Convert PDF, HTML, Word to Markdown effortlessly with MarkDownAI. Fast, accurate, and AI-powered file conversions.",
  keywords: "PDF to Markdown, HTML to Markdown, Word to Markdown, AI Markdown converter, document conversion, free markdown converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12">
          {/* 页面最顶部的 Logo 和应用名称 - 现在使用简单的 <img> 标签 */}
          <header className="w-full max-w-4xl flex items-center justify-start mb-1"> {/* mb-1 (4px) 相当于 mb-4 (16px) 的 25% */}
            <Link href="/" className="flex items-center space-x-2">
              <img // <-- 关键修改：直接使用标准的 <img> 标签
                src="https://ciwjjfcuhubjydajazkk.supabase.co/storage/v1/object/public/webstie-icon//MarkdownAI%20Fav%20icon.png"
                alt="MarkdownAI Logo"
                width={32} // 指定宽度
                height={32} // 指定高度
                style={{ verticalAlign: 'middle' }} // 辅助对齐，如果需要
              />
              <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                MarkdownAI
              </span>
            </Link>
          </header>

          {/* 全局导航菜单 - 紧随 Logo 下方 */}
          <Navigation />

          {/* 主要内容区域，这里会渲染 page.tsx 或其他页面的内容 */}
          <main className="flex-1 w-full max-w-4xl py-6 md:py-12">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}