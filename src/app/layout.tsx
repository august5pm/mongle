import type { Metadata } from "next";
import { Dongle, Nunito } from "next/font/google";
import localFont from "next/font/local";
import { BottomNav } from "@/components/BottomNav";
import { JournalFab } from "@/components/JournalFab";
import { ViewTransitionRouteWatcher } from "@/components/MediaLink";
import { NavigationProgress } from "@/components/NavigationProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { TopAppBar } from "@/components/TopAppBar";
import {
  BASE_OPEN_GRAPH,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
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
  metadataBase: SITE_URL,
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    // url은 두지 않는다 — 하위 페이지가 물려받으면 모든 공유 링크가 홈으로 묶임
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
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
        <a href="#main-content" className="skip-to-content accent-fill">
          본문으로 건너뛰기
        </a>
        <TopAppBar />
        <main
          id="main-content"
          className="min-h-screen pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0"
          tabIndex={-1}
        >
          <div className="app-shell">
            {children}
            <SiteFooter />
          </div>
        </main>
        <JournalFab />
        <BottomNav />
        <ViewTransitionRouteWatcher />
        <NavigationProgress />
      </body>
    </html>
  );
}
