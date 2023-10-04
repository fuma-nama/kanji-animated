import "./globals.css";
import type { Metadata } from "next";
import { Shippori_Mincho } from "next/font/google";

import clsx from "clsx";

export const metadata: Metadata = {
  title: "Fuma Nama の",
  description: "Something cool",
};

const font = Shippori_Mincho({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(font.className, "text-white bg-black")}>
        {children}
      </body>
    </html>
  );
}
