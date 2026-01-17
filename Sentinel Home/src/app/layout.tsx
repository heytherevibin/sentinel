import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Enterprise Tech Font
import "./globals.css";

const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Sentinel // Oversight",
  description: "Enterprise Data Loss Prevention System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains.variable} font-mono bg-c2-bg text-c2-text antialiased selection:bg-c2-accent selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
