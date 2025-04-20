"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignIn } from "../SignIn";
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith("/chats/");

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="House Dashboard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="House Dashboard" />
        <meta
          name="description"
          content="A dashboard for managing your house and rent payments"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#635BFF" />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <ConvexClientProvider>
          <Unauthenticated>
            <SignIn />
          </Unauthenticated>
          <Authenticated>
            <div className="flex flex-col flex-1">
              <div className="flex-1">{children}</div>
              {!isChatPage && <NavBar />}
            </div>
          </Authenticated>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
