import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "GrowthAI — AI Workforce for Your Business",
  description:
    "GrowthAI deploys intelligent AI agents that capture leads, communicate with customers, automate workflows, and help businesses grow.",
  applicationName: "GrowthAI",
  keywords: [
    "GrowthAI",
    "AI agents",
    "AI workforce",
    "business automation",
    "lead generation",
    "customer automation",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#06090F] text-white antialiased">
        <div id="growthai-root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
