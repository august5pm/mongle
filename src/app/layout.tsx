import type { Metadata } from "next";
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

/*
 * 글꼴은 모두 저장소에 둔다 (next/font/google 미사용).
 * 빌드 때 Google Fonts를 받아오면 가끔 확장자 없는 주소(l/font?kit=…)가 와서
 * Next 14의 폰트 로더가 실패했다 — CI·Vercel 빌드가 외부 네트워크에 의존하지 않게 한다.
 * 라이선스: src/app/fonts/licenses (모두 SIL OFL 1.1)
 */

/**
 * 로고 워드마크 전용 Dongle — Google Fonts text 서브셋으로 「몽글Mongle」 8글자만 담았다.
 * font-brand로 다른 글자를 쓰면 다음 글꼴(Pretendard)로 표시된다.
 */
const dongle = localFont({
  src: [
    { path: "./fonts/Dongle-Brand-400.woff2", weight: "400" },
    { path: "./fonts/Dongle-Brand-700.woff2", weight: "700" },
  ],
  variable: "--font-brand",
  display: "swap",
});

/** 영문 본문 — Nunito 가변(라틴 범위). 한글·그 밖의 문자는 Pretendard가 받는다 */
const nunito = localFont({
  src: "./fonts/Nunito-latin-variable.woff2",
  variable: "--font-sans",
  weight: "200 1000",
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
