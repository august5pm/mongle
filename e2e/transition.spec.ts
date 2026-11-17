import { expect, test } from "@playwright/test";
import { MOCK_MEDIA_ID, recordViewTransitions, viewTransitions } from "./helpers";

test.describe("포스터 → 상세 공유 요소 전환", () => {
  test.beforeEach(async ({ page }) => {
    await recordViewTransitions(page);
  });

  test("홈 포스터를 누르면 전환과 함께 상세로 이동한다", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(".poster-card").first();
    await card.scrollIntoViewIfNeeded();
    const href = await card.getAttribute("href");
    await card.click();
    await page.waitForURL(`**${href}`);
    await expect.poll(() => viewTransitions(page)).toEqual([{ finished: true }]);
    await expect(page.locator(".vt-media-hero")).toBeVisible();
    // 임시로 붙인 view-transition-name이 남지 않는다
    await expect(page.locator("[style*='view-transition-name']")).toHaveCount(0);
  });

  test("히어로 '자세히 보기'도 전환으로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.locator("#home-hero").getByRole("link", { name: "자세히 보기" }).click();
    await page.waitForURL("**/movie/**");
    await expect.poll(() => viewTransitions(page)).toEqual([{ finished: true }]);
  });

  test("상세 → 관련 작품 → 상세 전환 (이름 중복 없이)", async ({ page }) => {
    await page.goto(`/movie/${MOCK_MEDIA_ID}`);
    const related = page.locator("main a.group[href^='/movie/']").first();
    await related.scrollIntoViewIfNeeded();
    const href = await related.getAttribute("href");
    await related.click();
    await page.waitForURL(`**${href}`);
    await expect.poll(() => viewTransitions(page)).toEqual([{ finished: true }]);
  });
});

test.describe("움직임 줄이기 설정에서는 전환 없이 이동", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("전환을 시작하지 않는다", async ({ page }) => {
    await recordViewTransitions(page);
    await page.goto("/");
    const card = page.locator(".poster-card").first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await page.waitForURL("**/movie/**");
    expect(await viewTransitions(page)).toEqual([]);
  });
});
