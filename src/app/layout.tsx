import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { Toaster } from "@/components/ui/sonner" // 1. 导入 Toaster 组件

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarkDownAI Converter: PDF,Word,HTML,PPT,EXCEL,CSV,txt,epub to Markdown Converter Free",
  description: "MarkDownAI is a professional online document converter. Easily transform PDF, Word, HTML, PPT, Excel, CSV, TXT, and ePub files into high-quality Markdown format for free. Simple, accurate, and efficient conversions.",
  keywords: "markdown converter, online markdown converter, PDF to Markdown, Word to Markdown, HTML to Markdown, PPT to Markdown, Excel to Markdown, CSV to Markdown, TXT to Markdown, ePub to Markdown, free document converter, file format converter, convert to markdown, markdown online, document to markdown",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        
        <Toaster /> {/* 2. 在这里放置 Toaster 组件 */}

        {/* Google Analytics Scripts */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-LKWQLR5STV" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LKWQLR5STV');
          `}
        </Script>

      </body>
    </html>
  );
}