import type { Metadata } from "next";
import Link from "next/link";
import {
  StatusScreen,
  statusPrimaryClass,
  statusSecondaryClass,
} from "@/components/StatusScreen";

export const metadata: Metadata = {
  title: "작품을 찾을 수 없어요",
};

/** 상세 — 없는 작품 ID */
export default function MovieNotFound() {
  return (
    <StatusScreen
      eyebrow="404"
      title="이 작품을 찾을 수 없어요"
      description="삭제됐거나 잘못된 주소일 수 있어요. 제목으로 다시 찾아보세요."
      actions={
        <>
          <Link href="/explore" className={statusPrimaryClass}>
            작품 찾기
          </Link>
          <Link href="/" className={statusSecondaryClass}>
            홈으로
          </Link>
        </>
      }
    />
  );
}
