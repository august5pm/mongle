import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Compass, PenLine, type LucideIcon } from "lucide-react";
import { sentiments } from "@/data/mock";
import { EMOTION_COLOR } from "@/lib/emotion-colors";
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE } from "@/lib/site";

const DESCRIPTION =
  "몽글은 영화와 드라마를 보고 난 뒤의 감정을 한 줄로 남기는 곳이에요. 고르고, 기록하고, 돌아보는 방법을 소개해요.";

export const metadata: Metadata = {
  title: "몽글 소개",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: "몽글 소개",
    description: DESCRIPTION,
    url: "/about",
    images: [DEFAULT_OG_IMAGE],
  },
};

const STEPS: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  cta: string;
}[] = [
  {
    icon: Compass,
    title: "고르기",
    body: "오늘 뜨는 작품, 날마다 바뀌는 큐레이션, 검색과 감정 칩으로 지금 기분에 맞는 작품을 찾아요. 마음에 든 작품은 위시리스트에 담아 둘 수 있어요.",
    href: "/explore",
    cta: "작품 찾기",
  },
  {
    icon: PenLine,
    title: "기록하기",
    body: "보고 난 뒤 남은 감정을 네 가지 중에서 고르고, 한 줄 메모(140자까지)를 남겨요. 이 기록을 몽글이라고 불러요.",
    href: "/journal/new",
    cta: "몽글 남기기",
  },
  {
    icon: BarChart3,
    title: "돌아보기",
    body: "아카이브에서 다른 사람의 몽글을 읽고 좋아요를 남겨요. 감정 통계에서는 내가 어떤 감정을 자주 느꼈는지 달별로 볼 수 있어요.",
    href: "/stats",
    cta: "감정 통계",
  },
];

const FACTS: { term: string; detail: React.ReactNode }[] = [
  {
    term: "공개 범위",
    detail:
      "남긴 몽글은 닉네임·이모지와 함께 ‘모두의 몽글’에 공개돼요. 이메일은 보이지 않고, 위시리스트는 나만 볼 수 있어요.",
  },
  {
    term: "로그인",
    detail:
      "Google 계정으로 로그인해요. 둘러보기는 로그인 없이 할 수 있고, 기록·좋아요·위시리스트에만 필요해요.",
  },
  {
    term: "작품 정보",
    detail: (
      <>
        작품 정보와 이미지는{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface underline underline-offset-4 hover:text-primary"
        >
          TMDB
        </a>
        에서 가져와요. 몽글은 TMDB의 승인이나 보증을 받은 서비스가 아니에요.
      </>
    ),
  },
  {
    term: "만든 사람",
    detail: (
      <>
        <a
          href="https://github.com/august5pm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface underline underline-offset-4 hover:text-primary"
        >
          august5pm
        </a>
        이 혼자 만드는 개인 프로젝트예요. 코드는{" "}
        <a
          href="https://github.com/august5pm/mongle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface underline underline-offset-4 hover:text-primary"
        >
          GitHub
        </a>
        에 공개되어 있어요.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl pb-8 pt-28">
      <section className="flex flex-col items-start">
        <span className="relative mb-6 h-14 w-[4.5rem] drop-shadow-[0_8px_20px_rgba(180,200,230,0.3)]" aria-hidden>
          <Image src="/cloud.png" alt="" fill sizes="72px" className="object-contain" priority />
        </span>
        <p className="mb-3 text-label-sm tracking-widest text-primary">몽글 소개</p>
        <h1 className="text-balance break-keep font-display text-display-lg-mobile text-on-surface md:text-display-lg">
          영화가 끝난 뒤에 남는 감정을 기록하는 곳
        </h1>
        <p className="mt-5 max-w-2xl break-keep text-body-lg text-on-surface-variant">
          보통의 작품 탐색은 지금 무엇이 인기 있는지에 집중해요. 몽글은 지금 기분에 맞는
          작품을 고르고, 보고 난 뒤의 감정을 한 줄로 남겨 오래 간직하는 데 집중해요.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="accent-fill inline-flex rounded-full px-6 py-3 text-sm font-bold"
          >
            둘러보기
          </Link>
          <Link
            href="/archive"
            className="soft-fill inline-flex rounded-full px-6 py-3 text-sm font-semibold"
          >
            모두의 몽글 읽기
          </Link>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="about-steps">
        <h2 id="about-steps" className="mb-6 font-display text-headline-md text-on-surface">
          이렇게 써요
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body, href, cta }, i) => (
            <li key={title} className="reveal surface-panel flex flex-col rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="soft-fill flex h-10 w-10 items-center justify-center rounded-full text-primary">
                  <Icon size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-xs tabular-nums text-on-surface-variant">
                  {i + 1}단계
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-on-surface">{title}</h3>
              <p className="mt-2 flex-1 break-keep text-sm leading-relaxed text-on-surface-variant">
                {body}
              </p>
              <Link
                href={href}
                className="mt-5 text-sm font-semibold text-on-surface underline-offset-4 transition-colors duration-fast hover:text-primary hover:underline"
              >
                {cta} →
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20" aria-labelledby="about-emotions">
        <h2 id="about-emotions" className="font-display text-headline-md text-on-surface">
          네 가지 감정
        </h2>
        <p className="mb-6 mt-2 break-keep text-sm text-on-surface-variant">
          몽글을 남길 때 고르는 감정이에요. 감정 통계에서도 같은 색으로 보여요.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sentiments.map((s) => (
            <li
              key={s.id}
              data-emotion={s.id}
              className="reveal surface-panel flex items-start gap-4 rounded-2xl p-5"
            >
              <span
                aria-hidden
                className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                style={{ background: EMOTION_COLOR[s.id] }}
              />
              <div>
                <p className="font-semibold text-on-surface">{s.label}</p>
                <p className="mt-1 break-keep text-sm text-on-surface-variant">
                  {s.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20" aria-labelledby="about-facts">
        <h2 id="about-facts" className="mb-6 font-display text-headline-md text-on-surface">
          알아 두면 좋은 것
        </h2>
        <dl className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {FACTS.map(({ term, detail }) => (
            <div key={term} className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-on-surface">{term}</dt>
              <dd className="break-keep text-sm leading-relaxed text-on-surface-variant">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
