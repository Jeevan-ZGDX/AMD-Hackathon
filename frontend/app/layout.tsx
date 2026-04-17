import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], variable: '--font-syne' });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "NexGen Retail OS",
  description: "Enterprise Retail Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${spaceMono.variable} font-syne antialiased pt-20`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
