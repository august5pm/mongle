"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { sentiments, type JournalEntry, type Sentiment } from "@/data/mock";
import {
  fetchMyJournals,
  fetchPublicJournals,
  getSeedJournals,
} from "@/lib/journal";
import {
  SENTIMENT_ORDER,
  computeEmotionStats,
  type EmotionStats,
  type MonthBucket,
} from "@/lib/journal-stats";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/** globals.css --emotion-* — 쌓는 순서(SENTIMENT_ORDER)와 함께 검증한 색 */
const EMOTION_COLOR: Record<Sentiment, string> = {
  Dreamy: "var(--emotion-dreamy)",
  Warm: "var(--emotion-warm)",
  Intense: "var(--emotion-intense)",
  Soft: "var(--emotion-soft)",
};

const LABELS = Object.fromEntries(
  sentiments.map((s) => [s.id, s.label]),
) as Record<Sentiment, string>;

type Scope = "mine" | "all";

const PLOT_HEIGHT = 168;

export function StatsClient() {
  const [user, setUser] = useState<User | null>(null);
  const [scope, setScope] = useState<Scope>("all");
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [myEntries, setMyEntries] = useState<JournalEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!isSupabaseConfigured()) {
          if (!cancelled) setAllEntries(getSeedJournals());
          return;
        }
        const supabase = createClient();
        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        const [publicFeed, mine] = await Promise.all([
          fetchPublicJournals(),
          u ? fetchMyJournals() : Promise.resolve([]),
        ]);
        if (cancelled) return;
        setUser(u);
        setAllEntries(publicFeed);
        setMyEntries(mine);
        // 로그인했다면 내 통계부터
        if (u) setScope("mine");
      } catch (e) {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : "불러오기 실패");
        setAllEntries(getSeedJournals());
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => computeEmotionStats(scope === "mine" ? myEntries : allEntries),
    [scope, allEntries, myEntries],
  );

  const tabClass = (active: boolean) =>
    `rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-fast ${
      active
        ? "accent-fill"
        : "surface-panel text-on-surface-variant hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
    }`;

  return (
    <div className="pb-8 pt-24">
      <header className="mb-8">
        <h1 className="mb-2 font-display text-display-lg-mobile text-on-surface md:text-display-lg">
          감정 통계
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          {scope === "mine"
            ? "내가 남긴 몽글에 어떤 감정이 담겼는지"
            : "모두가 남긴 몽글에 어떤 감정이 담겼는지"}
        </p>
        {loadError ? (
          <p className="mt-2 text-sm text-error">{loadError}</p>
        ) : null}
      </header>

      <div className="mb-8 flex gap-2" role="tablist" aria-label="통계 범위">
        <button
          type="button"
          role="tab"
          aria-selected={scope === "mine"}
          disabled={!user}
          onClick={() => setScope("mine")}
          className={tabClass(scope === "mine")}
        >
          내 몽글
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "all"}
          onClick={() => setScope("all")}
          className={tabClass(scope === "all")}
        >
          모두의 몽글
        </button>
      </div>

      {!user && ready ? (
        <div className="surface-panel mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-on-surface-variant">
            로그인하면 내가 남긴 몽글만 모아 통계를 볼 수 있어요.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent("/stats")}`}
            className="accent-fill shrink-0 rounded-full px-5 py-2.5 text-sm font-bold"
          >
            로그인하기
          </Link>
        </div>
      ) : null}

      {!ready ? (
        <p className="text-on-surface-variant">불러오는 중…</p>
      ) : stats.total === 0 ? (
        <div className="surface-panel flex flex-col items-center gap-4 rounded-3xl px-6 py-12 text-center">
          <p className="text-body-md text-on-surface-variant">
            아직 남긴 몽글이 없어요. 첫 감정을 기록하면 여기에 모여요.
          </p>
          <Link
            href="/journal/new"
            className="accent-fill rounded-full px-6 py-3 text-sm font-bold"
          >
            몽글 남기기
          </Link>
        </div>
      ) : (
        <StatsBody stats={stats} />
      )}
    </div>
  );
}

function StatsBody({ stats }: { stats: EmotionStats }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SummaryTiles stats={stats} />
      <EmotionShareCard stats={stats} />
      <MonthlyCard months={stats.months} />
      {stats.genres.length > 0 ? <GenreCard stats={stats} /> : null}
    </div>
  );
}

function Swatch({ emotion, className = "" }: { emotion: Sentiment; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${className}`}
      style={{ background: EMOTION_COLOR[emotion] }}
    />
  );
}

function Card({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="surface-panel rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-headline-md text-on-surface">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function SummaryTiles({ stats }: { stats: EmotionStats }) {
  const top = stats.topEmotion;
  return (
    <dl className="grid grid-cols-3 gap-3 lg:col-span-2">
      <Tile label="전체 몽글" value={`${stats.total}`} />
      <Tile label="이번 달" value={`${stats.thisMonth}`} />
      <Tile
        label="가장 많은 감정"
        value={
          top ? (
            <span className="inline-flex items-center gap-2">
              <Swatch emotion={top.id} />
              {top.label}
            </span>
          ) : (
            "고르게"
          )
        }
      />
    </dl>
  );
}

function Tile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="surface-panel flex flex-col justify-between gap-2 rounded-3xl px-4 py-4 sm:px-6 sm:py-5">
      <dt className="text-xs text-on-surface-variant sm:text-sm">{label}</dt>
      <dd className="font-display text-xl font-bold tracking-tight text-on-surface sm:text-3xl">
        {value}
      </dd>
    </div>
  );
}

const pct = (share: number) => `${Math.round(share * 100)}%`;

function EmotionShareCard({ stats }: { stats: EmotionStats }) {
  return (
    <Card title="감정 분포" description={`몽글 ${stats.total}개에 담긴 감정`}>
      <ul className="space-y-5" aria-label="감정별 기록 수">
        {stats.emotions.map((e) => (
          <li key={e.id} data-emotion={e.id}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Swatch emotion={e.id} className="self-center" />
                <span className="font-semibold text-on-surface">{e.label}</span>
                <span className="hidden truncate text-xs text-on-surface-variant sm:inline">
                  {e.description}
                </span>
              </div>
              <span className="shrink-0 text-sm tabular-nums text-on-surface-variant">
                <span className="font-semibold text-on-surface">{e.count}개</span>
                {" · "}
                {pct(e.share)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-[width] duration-slow"
                style={{ width: pct(e.share), background: EMOTION_COLOR[e.id] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** 0부터 시작하는 눈금 두 칸 — 최댓값이 작아도 정수 눈금 */
function niceScale(max: number) {
  const step = Math.max(1, Math.ceil(max / 2));
  return { top: step * 2, ticks: [0, step, step * 2] };
}

function MonthlyCard({ months }: { months: MonthBucket[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const max = Math.max(...months.map((m) => m.total));
  const { top, ticks } = niceScale(max);

  return (
    <Card
      title="월별 감정 흐름"
      description="최근 6개월"
      aside={
        <button
          type="button"
          onClick={() => setAsTable((v) => !v)}
          className="soft-fill shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
          aria-pressed={asTable}
        >
          {asTable ? "차트로 보기" : "표로 보기"}
        </button>
      }
    >
      <ul className="mb-6 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="범례">
        {SENTIMENT_ORDER.map((id) => (
          <li key={id} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Swatch emotion={id} />
            {LABELS[id]}
          </li>
        ))}
      </ul>

      {asTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm tabular-nums">
            <caption className="sr-only">최근 6개월 월별 감정 기록 수</caption>
            <thead className="text-xs text-on-surface-variant">
              <tr className="border-b border-white/10">
                <th scope="col" className="py-2 pr-3 font-medium">달</th>
                {SENTIMENT_ORDER.map((id) => (
                  <th key={id} scope="col" className="px-2 py-2 text-right font-medium">
                    {LABELS[id]}
                  </th>
                ))}
                <th scope="col" className="py-2 pl-2 text-right font-medium">합계</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.key} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="py-2 pr-3 font-medium text-on-surface">
                    {m.label}
                  </th>
                  {SENTIMENT_ORDER.map((id) => (
                    <td key={id} className="px-2 py-2 text-right text-on-surface-variant">
                      {m.counts[id]}
                    </td>
                  ))}
                  <td className="py-2 pl-2 text-right font-semibold text-on-surface">
                    {m.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-2" onMouseLeave={() => setActive(null)}>
          {/* y축 — 0과 눈금 두 개만, 흐리게 */}
          <div
            className="relative w-5 shrink-0 text-right text-[11px] tabular-nums text-on-surface-variant/70"
            style={{ height: PLOT_HEIGHT }}
            aria-hidden
          >
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute right-0 translate-y-1/2"
                style={{ bottom: (t / top) * PLOT_HEIGHT }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="relative"
              style={{ height: PLOT_HEIGHT }}
              data-testid="monthly-plot"
            >
              {ticks.map((t) => (
                <div
                  key={t}
                  aria-hidden
                  className={`absolute inset-x-0 border-t ${
                    t === 0 ? "border-white/20" : "border-dashed border-white/[0.07]"
                  }`}
                  style={{ bottom: (t / top) * PLOT_HEIGHT }}
                />
              ))}

              {max === 0 ? (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant">
                  최근 6개월 동안 남긴 몽글이 없어요
                </p>
              ) : null}

              <div className="absolute inset-0 flex">
                {months.map((m, i) => {
                  const h = (m.total / top) * PLOT_HEIGHT;
                  const filled = SENTIMENT_ORDER.filter((id) => m.counts[id] > 0);
                  const summary = filled.length
                    ? filled.map((id) => `${LABELS[id]} ${m.counts[id]}`).join(", ")
                    : "기록 없음";
                  return (
                    <button
                      key={m.key}
                      type="button"
                      className="group relative flex flex-1 items-end justify-center outline-offset-0"
                      aria-label={`${m.label} ${m.total}개 — ${summary}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive((v) => (v === i ? null : i))}
                      data-month={m.key}
                    >
                      <span
                        className={`absolute inset-x-1 inset-y-0 rounded-lg transition-colors duration-fast ${
                          active === i ? "bg-white/[0.04]" : ""
                        }`}
                        aria-hidden
                      />
                      {/* 아래부터 몽환·따뜻함·강렬·잔잔함 — 조각 사이 2px 틈 */}
                      <span
                        className="relative flex w-6 flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px] transition-[height] duration-slow"
                        style={{ height: h }}
                        aria-hidden
                      >
                        {filled.map((id) => (
                          <span
                            key={id}
                            className="min-h-[2px]"
                            style={{
                              flex: `${m.counts[id]} 1 0`,
                              background: EMOTION_COLOR[id],
                            }}
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>

              {active !== null ? (
                <MonthTooltip
                  month={months[active]}
                  index={active}
                  count={months.length}
                />
              ) : null}
            </div>

            <div className="mt-2 flex" aria-hidden>
              {months.map((m, i) => (
                <span
                  key={m.key}
                  className={`flex-1 text-center text-xs ${
                    i === months.length - 1 || active === i
                      ? "font-semibold text-on-surface"
                      : "text-on-surface-variant"
                  }`}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function MonthTooltip({
  month,
  index,
  count,
}: {
  month: MonthBucket;
  index: number;
  count: number;
}) {
  // 고른 달과 반대쪽 위 모서리에 띄운다 — 막대를 덜 가리고 좁은 화면에서도 넘치지 않음
  const side = index < count / 2 ? { right: 0 } : { left: 0 };

  return (
    <div
      role="status"
      data-testid="monthly-tooltip"
      className="pointer-events-none absolute z-10 w-40 rounded-xl border border-white/10 bg-[#14181c] p-3 text-xs shadow-lg"
      style={{ top: 0, ...side }}
    >
      <p className="mb-2 flex items-baseline justify-between font-semibold text-on-surface">
        <span>{month.label}</span>
        <span className="tabular-nums">{month.total}개</span>
      </p>
      <ul className="space-y-1">
        {SENTIMENT_ORDER.map((id) => (
          <li key={id} className="flex items-center justify-between gap-2 text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Swatch emotion={id} className="h-2 w-2" />
              {LABELS[id]}
            </span>
            <span className="tabular-nums text-on-surface">{month.counts[id]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GenreCard({ stats }: { stats: EmotionStats }) {
  const max = stats.genres[0]?.count ?? 1;
  return (
    <Card title="자주 기록한 장르" description="몽글을 많이 남긴 장르 다섯 개까지">
      <ol className="space-y-3" aria-label="장르별 기록 수">
        {stats.genres.map((g, i) => (
          <li key={g.label} className="grid grid-cols-[1.25rem_5.5rem_1fr_2.5rem] items-center gap-3 text-sm">
            <span className="tabular-nums text-on-surface-variant">{i + 1}</span>
            <span className="truncate font-semibold text-on-surface">{g.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
              <span
                className="block h-full rounded-full bg-[var(--accent)] transition-[width] duration-slow"
                style={{ width: `${(g.count / max) * 100}%` }}
              />
            </span>
            <span className="text-right tabular-nums text-on-surface-variant">{g.count}개</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
