import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import HandTrackingProvider from "@/components/HandTrackingProvider";
import HandTrackingToggle from "@/components/HandTrackingToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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
        >{`(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`}</Script>
        <ThemeProvider>
          <HandTrackingProvider>
            <ThemeToggle />
            <HandTrackingToggle />
            {children}
          </HandTrackingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
