import type { Page, TestInfo } from "@playwright/test";

/** mock 데이터에 항상 있는 작품 — TMDB 키 유무와 관계없이 상세가 열린다 */
export const MOCK_MEDIA_ID = "hero-1";

export const isMobile = (testInfo: TestInfo) => testInfo.project.name === "mobile";

/** 페이지 끝까지 천천히 스크롤 — 스크롤 등장(.reveal)·지연 로드 이미지를 깨운다 */
export async function scrollThrough(page: Page, step = 300) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(40);
  }
}

/** 처리되지 않은 예외만 모은다 (TMDB 키 없을 때의 503 콘솔 로그 등은 제외) */
export function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

/** document.startViewTransition 호출과 결과를 기록 (페이지 로드 전에 주입) */
export async function recordViewTransitions(page: Page) {
  await page.addInitScript(() => {
    type Rec = { finished?: boolean; error?: string; namedTargets?: number };
    const w = window as unknown as { __vt: Rec[] };
    w.__vt = [];
    const original = document.startViewTransition?.bind(document);
    if (!original) return;
    document.startViewTransition = ((cb: () => Promise<void> | void) => {
      const rec: Rec = {};
      w.__vt.push(rec);
      const t = original(cb);
      // 새 화면에서 전환 도착점으로 이름이 붙은 요소 수 (돌아오는 전환에서만 생김)
      t.updateCallbackDone.then(() => {
        const n = document.querySelectorAll("[style*='view-transition-name: media-hero']").length;
        if (n) rec.namedTargets = n;
      });
      t.finished.then(
        () => (rec.finished = true),
        (e: unknown) => (rec.error = String(e)),
      );
      return t;
    }) as typeof document.startViewTransition;
  });
}

export const viewTransitions = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as unknown as {
          __vt: { finished?: boolean; error?: string; namedTargets?: number }[];
        }
      ).__vt,
  );
