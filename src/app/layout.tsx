import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"

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
  title: "Nirmal V G | Software Engineer — React, Next.js, TypeScript",
  description:
    "Portfolio of Nirmal V G — Software Engineer with 2+ years of experience building high-performance, scalable web applications using React, Next.js, and TypeScript.",
  keywords: [
    "Nirmal V G",
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Frontend Developer",
    "Full Stack Developer",
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
    title: "Nirmal V G | Software Engineer",
    description:
      "2+ years crafting high-performance web applications with React, Next.js & TypeScript.",
    url: "https://nirmalvg.github.io",
    siteName: "Nirmal V G — Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://nirmalvg.github.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nirmal V G — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirmal V G | Software Engineer",
    description:
      "2+ years crafting high-performance web applications with React, Next.js & TypeScript.",
    images: ["https://nirmalvg.github.io/og-image.png"],
  },
  other: {
    "theme-color": "#050505",
    "og:image:secure_url": "https://nirmalvg.github.io/og-image.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
