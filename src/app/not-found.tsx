import type { Metadata } from "next";
import Link from "next/link";
import {
  StatusScreen,
  statusPrimaryClass,
  statusSecondaryClass,
} from "@/components/StatusScreen";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
};

export default function NotFound() {
  return (
    <StatusScreen
      eyebrow="404"
      title="찾는 장면이 없어요"
      description="주소가 바뀌었거나 사라진 페이지예요. 다른 작품을 찾아볼까요?"
      actions={
        <>
          <Link href="/" className={statusPrimaryClass}>
            홈으로
          </Link>
          <Link href="/explore" className={statusSecondaryClass}>
            작품 찾기
          </Link>
        </>
      }
    />
  );
}
