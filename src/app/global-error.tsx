"use client";

import "./globals.css";
import { useEffect } from "react";
import {
  StatusScreen,
  statusPrimaryClass,
  statusSecondaryClass,
} from "@/components/StatusScreen";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * 루트 레이아웃까지 실패했을 때의 마지막 안전망 — 레이아웃(상단바·폰트)이 없으므로
 * html/body를 직접 그리고, 이동은 전체 새로고침(<a>)으로 한다.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko" className="dark">
      <body className="bg-background text-on-surface antialiased">
        <main className="app-shell">
          <StatusScreen
            title="몽글을 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
            actions={
              <>
                <button
                  type="button"
                  onClick={reset}
                  className={statusPrimaryClass}
                >
                  다시 시도
                </button>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 레이아웃이 깨진 상태라 전체 새로고침 */}
                <a href="/" className={statusSecondaryClass}>
                  홈으로
                </a>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
