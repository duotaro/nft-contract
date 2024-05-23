import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';
import { StateContextProvider } from "@/app/provider/StateContextProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1st DApp",
  description: "dapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col h-screen">
        <StateContextProvider>{children}</StateContextProvider>
        </main>
      </body>
    </html>
  );
}
