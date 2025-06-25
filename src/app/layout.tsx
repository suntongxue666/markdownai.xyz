import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 确保这一行在最前面！
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarkdownAI",
  description: "Convert any document to clean Markdown",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />

        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-LKWQLR5STV`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LKWQLR5STV');
            `,
          }}
        />
      </body>
    </html>
  );
}