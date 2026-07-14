import type { Metadata } from "next";
import Link from "next/link";
import { archiveStats } from "@/data/mock";

export const metadata: Metadata = {
  title: "프로필",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-lg px-container-mobile pb-8 pt-24 sm:px-container-desktop">
      <p className="text-label-sm tracking-widest text-primary">프로필</p>
      <h1 className="mt-3 font-display text-display-lg-mobile text-on-surface">
        나의 몽글
      </h1>

      <div className="glass-panel mt-8 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="pearl-clay flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
            몽
          </div>
          <div>
            <p className="font-display text-headline-md text-on-surface">
              시네마 드리머
            </p>
            <p className="mt-1 text-label-sm text-secondary">감정으로 영화를 모으는 중</p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-xs text-on-surface-variant">몽글</dt>
            <dd className="mt-1 font-display text-2xl text-primary">
              {archiveStats.totalMongles}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-on-surface-variant">이번 달</dt>
            <dd className="mt-1 font-display text-2xl text-primary">
              {archiveStats.thisMonth}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-on-surface-variant">연속</dt>
            <dd className="mt-1 font-display text-2xl text-primary">
              {archiveStats.streak}일
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 space-y-2">
        <Link
          href="/archive"
          className="glass-panel block rounded-2xl px-5 py-4 text-sm text-on-surface transition-colors hover:border-white/30"
        >
          저널 아카이브 보기 →
        </Link>
        <Link
          href="/explore"
          className="glass-panel block rounded-2xl px-5 py-4 text-sm text-on-surface transition-colors hover:border-white/30"
        >
          감정으로 탐색하기 →
        </Link>
      </div>
    </div>
  );
}
