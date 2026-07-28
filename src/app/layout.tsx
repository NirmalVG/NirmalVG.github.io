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

const siteUrl = "https://nirmalvg.github.io"
const ogImageUrl = `${siteUrl}/og-image.jpg`

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
  authors: [{ name: "Nirmal V G", url: siteUrl }],
  creator: "Nirmal V G",
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: "Nirmal V G — Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Nirmal V G — AI Engineer (Full Stack) Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirmal V G | AI Engineer (Full Stack)",
    description:
      "Building production-grade RAG systems and LLM-integrated full-stack applications — from vector retrieval pipelines to shipped UI.",
    images: [ogImageUrl],
  },
  other: {
    "theme-color": "#050505",
    "og:image:secure_url": ogImageUrl,
    "og:image:type": "image/jpeg",
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
