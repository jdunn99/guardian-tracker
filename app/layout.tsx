import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

import { SWRProvider } from "./swr-provider";
import { ManifestProvider } from "@/lib/manifest/useManifest";
import { Nav } from "@/components/navigation/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guardian Tracker",
  robots: {
    index: true,
    follow: true,
  },
  description: "Open-source Destiny 2 app for tracking a guardian's stats",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await Seed();
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Nav /> */}
        <SWRProvider>
          <ManifestProvider>
            <main className="min-h-screen  w-full bg-slate-900">
              <Nav />
              {children}
            </main>
          </ManifestProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
