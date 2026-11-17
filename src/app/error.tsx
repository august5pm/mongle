"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  StatusScreen,
  statusPrimaryClass,
  statusSecondaryClass,
} from "@/components/StatusScreen";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 페이지 렌더링 오류 (TMDB 장애 등) — 상단바·탭바는 유지되고 본문만 바뀐다 */
export default function RouteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      title="잠시 문제가 생겼어요"
      description={
        <>
          작품 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          {error.digest ? (
            <span className="mt-2 block text-xs text-on-surface-variant/50">
              오류 코드 {error.digest}
            </span>
          ) : null}
        </>
      }
      actions={
        <>
          <button type="button" onClick={reset} className={statusPrimaryClass}>
            다시 시도
          </button>
          <Link href="/" className={statusSecondaryClass}>
            홈으로
          </Link>
        </>
      }
    />
  );
}
