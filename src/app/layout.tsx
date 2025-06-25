import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarkdownAI-MarkdownConverter - Convert PDF, Word, PPT to Markdown",
  description: "Professional document converter that transforms PDF, Word, PowerPoint, and other files into clean Markdown format. Perfect for developers, writers, and content creators.",
  keywords: [
    "markdown converter",
    "pdf to markdown",
    "word to markdown",
    "ppt to markdown",
    "document converter",
    "file converter",
    "markdown",
    "pdf converter",
    "markitdown"
  ],
  authors: [{ name: "MarkDownAI Converter" }],
  creator: "MarkDownAI Converter",
  publisher: "MarkDownAI Converter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://markitdown-converter.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MarkDownAI Converter - Convert PDF,Word,HTML,PPT,Excel,CSV,txt,epub to Markdown",
    description: "Professional document converter that transforms PDF,Word,PPT,Excel,CSV,txt,epub and other files into clean Markdown format.",
    url: "https://markitdown-converter.vercel.app",
    siteName: "MarkDownAI Converter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MarkDownAI Converter - Document to Markdown Converter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkDownAI Converter - Convert PDF, Word, PPT to Markdown",
    description: "Professional document converter that transforms PDF, Word, PowerPoint, and other files into clean Markdown format.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LKWQLR5STV"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LKWQLR5STV');
        </script>
        <link rel="canonical" href="https://markitdown-converter.vercel.app" />
        <meta name="theme-color" content="#007AFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MarkDownAI" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          richColors
          theme="light"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }
          }}
        />
      </body>
    </html>
  );
}
