"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <title>Karen AI - Interview Coach</title>
        <meta name="description" content="Your sassy, smart interview coach" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <div className="max-w-md mx-auto h-screen overflow-hidden">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
