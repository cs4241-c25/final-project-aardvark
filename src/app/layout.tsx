import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AnonymousSessionProvider from "@/components/auth/AnonymousSessionProvider";
import SessionProvider from "@/components/auth/SessionProvider";
import { GameProvider } from "@/context/GameContext";
import { ToastProvider } from "@/context/ToastContext";
import { getServerSession } from "next-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consensus",
  description: "Where do your opinions rank?",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <AnonymousSessionProvider>
            <ToastProvider>
              <GameProvider>
                {children}
              </GameProvider>
            </ToastProvider>
          </AnonymousSessionProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
