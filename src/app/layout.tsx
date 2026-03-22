import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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
  title: "Nirmal V G | Software Engineer - React, Next.js, TypeScript",
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
  ],
  openGraph: {
    title: "Nirmal V G | Software Engineer",
    description:
      "2+ years crafting high-performance web applications with React, Next.js & TypeScript.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
