import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Enterprise Tech Font
import "./globals.css";

const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Sentinel // Oversight",
  description: "Enterprise Data Loss Prevention System",
};

import { SentinelProvider } from "@/components/SentinelProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains.variable} font-mono bg-c2-bg text-c2-text antialiased selection:bg-emerald-500/40 selection:text-emerald-100 relative h-screen overflow-hidden`}>
        <SentinelProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>

          {/* Global Mesh Grid Background */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('/grid.svg')] bg-[length:30px_30px]" />
        </SentinelProvider>
      </body>
    </html>
  );
}
