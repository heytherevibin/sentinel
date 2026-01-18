import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Enterprise Tech Font
import "./globals.css";

const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Sentinel // Oversight",
  description: "Enterprise Data Loss Prevention System",
};

import { SentinelProvider } from "@/components/SentinelProvider";
import { Header } from "@/components/Header";
import { TechFooter } from "@/components/TechFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains.variable} font-mono bg-c2-bg text-c2-text antialiased selection:bg-c2-accent selection:text-black relative h-screen overflow-hidden`}>
        <SentinelProvider>
          <div className="flex flex-col h-full relative z-10">
            <Header />
            <div className="flex-1 min-h-0 relative">
              {children}
            </div>
            <TechFooter />
          </div>

          {/* Global Mesh Grid Background */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('/grid.svg')] bg-[length:30px_30px]" />
        </SentinelProvider>
      </body>
    </html>
  );
}
