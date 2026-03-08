import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inthisone Jobs | AI-Powered Job Application Tracker",
  description: "Land the job faster with AI-powered tools that analyze job descriptions, generate tailored cover letters, and organize your job applications in one place.",
  keywords: ["job tracker", "job application", "cover letter generator", "AI job search", "career management"],
  openGraph: {
    title: "Inthisone Jobs | Land the Job Faster",
    description: "AI-powered tools that analyze job descriptions, generate tailored cover letters, and organize your job applications.",
    url: "https://jobs.inthisone.com",
    siteName: "Inthisone Jobs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inthisone Jobs | AI-Powered Job Tracker",
    description: "Land the job faster with AI-powered job search tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
