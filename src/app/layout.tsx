import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import ThemeProvider from "@/components/ThemeProvider"
import ThemeToggle from "@/components/ThemeToggle"
import HandTrackingProvider from "@/components/HandTrackingProvider"
import HandTrackingToggle from "@/components/HandTrackingToggle"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nirmal V G | AI Engineer (Full Stack) — RAG, LLMs, Next.js, FastAPI",
  description:
    "Portfolio of Nirmal V G — AI Engineer (Full Stack) building production RAG systems, LLM-integrated applications, and scalable full-stack products using Python, FastAPI, React, and Next.js.",
  keywords: [
    "Nirmal V G",
    "AI Engineer",
    "AI Engineer Full Stack",
    "Full Stack AI Engineer",
    "RAG",
    "LLM Engineering",
    "Python",
    "FastAPI",
    "React",
    "Next.js",
    "TypeScript",
    "Vector Search",
    "Portfolio",
    "Kerala",
  ],
  authors: [{ name: "Nirmal V G", url: "https://nirmalvg.github.io" }],
  creator: "Nirmal V G",
  metadataBase: new URL("https://nirmalvg.github.io"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Nirmal V G | AI Engineer (Full Stack)",
    description:
      "Building production-grade RAG systems and LLM-integrated full-stack applications — from vector retrieval pipelines to shipped UI.",
    url: "https://nirmalvg.github.io",
    siteName: "Nirmal V G — Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://nirmalvg.github.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nirmal V G — AI Engineer (Full Stack) Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirmal V G | AI Engineer (Full Stack)",
    description:
      "Building production-grade RAG systems and LLM-integrated full-stack applications — from vector retrieval pipelines to shipped UI.",
    images: ["https://nirmalvg.github.io/og-image.png"],
  },
  other: {
    "theme-color": "#050505",
    "og:image:secure_url": "https://nirmalvg.github.io/og-image.png",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >{`(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`}</Script>
        <ThemeProvider>
          <HandTrackingProvider>
            <ThemeToggle />
            <HandTrackingToggle />
            {children}
          </HandTrackingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
