import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { Seed } from "@/prisma/seed";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guardian Tracker",
  robots: {
    index: true,
    follow: true,
  },
  description: "Open-source Destiny 2 app for tracking a guardian's stats",
};

// async function buildManifest() {
//   const manifestResponse = await getDestinyManifest($http);
//   const manifest = await getDestinyManifestComponent($http, {
//     destinyManifest: manifestResponse.Response,
//     language: "en",
//     tableName: "DestinyInventoryItemDefinition",
//   });

//   const temp = {} as any;

//   for (const key in manifest) {
//     if (manifest.hasOwnProperty(key)) {
//       const item = manifest[key];

//       if (item.displayProperties.name === "") {
//         continue;
//       }

//       temp[key] = {
//         displayProperties: item.displayProperties,
//         tooltipNotifications: item.tooltipNotifications,
//         defaultDamageType: item.defaultDamageType,
//       };
//     }
//   }

//   fs.writeFile(
//     "inventoryManifest.json",
//     JSON.stringify(temp, null, 2),
//     (err) => {
//       if (err) throw err;
//       console.log("Data written successfully");
//     }
//   );
// }

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
        {children}
      </body>
    </html>
  );
}
