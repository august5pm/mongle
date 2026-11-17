import Image from "next/image";
import type { ReactNode } from "react";

type StatusScreenProps = {
  /** 작게 위에 붙는 상태 표시 (예: 404) */
  eyebrow?: string;
  title: string;
  description: ReactNode;
  /** 버튼 영역 — accent-fill(주) / soft-fill(보조) 링크·버튼 */
  actions: ReactNode;
};

/** 404·오류 공용 화면 — 몽글 구름 + 제목 + 설명 + 행동 버튼 */
export function StatusScreen({
  eyebrow,
  title,
  description,
  actions,
}: StatusScreenProps) {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center px-2 pb-8 pt-28 text-center">
      <span className="relative mb-6 h-16 w-20 opacity-90" aria-hidden>
        <Image
          src="/cloud.png"
          alt=""
          fill
          sizes="80px"
          className="object-contain grayscale-[30%]"
        />
      </span>
      {eyebrow ? (
        <p className="mb-2 text-label-sm text-on-surface-variant/70">{eyebrow}</p>
      ) : null}
      <h1 className="text-balance break-keep font-display text-display-lg-mobile text-on-surface md:text-display-lg">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-balance break-keep text-body-md text-on-surface-variant">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {actions}
      </div>
    </section>
  );
}

export const statusPrimaryClass =
  "accent-fill inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold";
export const statusSecondaryClass =
  "soft-fill inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold";
