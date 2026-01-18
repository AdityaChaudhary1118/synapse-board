import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Switched to stable 'Inter' font
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synapse Board",
  description: "A collaborative whiteboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}