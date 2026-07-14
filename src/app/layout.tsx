import type { Metadata } from "next";
import { Dongle, Nunito } from "next/font/google";
import localFont from "next/font/local";
import { BottomNav } from "@/components/BottomNav";
import { JournalFab } from "@/components/JournalFab";
import { TopAppBar } from "@/components/TopAppBar";
import "./globals.css";

/** 몽글 브랜드·제목용 — 둥글고 귀여운 한글 폰트 */
const dongle = Dongle({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-display",
  display: "swap",
});

/** 본문용 — 부드럽고 둥근 산세리프 */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-ko",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "몽글",
    template: "%s · 몽글",
  },
  description:
    "몽글(Mongle) — 영화와 감정을 부드럽게 기록하는 시네마틱 공간.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${dongle.variable} ${nunito.variable} ${pretendard.variable} bg-background text-on-surface antialiased`}
      >
        <TopAppBar />
        <main className="min-h-screen pb-32">{children}</main>
        <JournalFab />
        <BottomNav />
      </body>
    </html>
  );
}
