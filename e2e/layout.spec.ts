import { expect, test } from "@playwright/test";
import { isMobile } from "./helpers";

test.describe("네비게이션", () => {
  test("데스크톱은 상단 탭, 모바일은 하단 탭바", async ({ page }, testInfo) => {
    await page.goto("/");
    const topTabs = page.locator("header nav[aria-label='주요 메뉴']");
    const bottomBar = page.locator("body > nav[aria-label='주요 메뉴']");
    if (isMobile(testInfo)) {
      await expect(bottomBar).toBeVisible();
      await expect(topTabs).toBeHidden();
    } else {
      await expect(topTabs).toBeVisible();
      await expect(bottomBar).toBeHidden();
    }
  });

  test("현재 탭이 aria-current로 표시되고 탭으로 이동한다", async ({ page }, testInfo) => {
    await page.goto("/");
    const nav = isMobile(testInfo)
      ? page.locator("body > nav[aria-label='주요 메뉴']")
      : page.locator("header nav[aria-label='주요 메뉴']");
    await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute("href", "/");
    await nav.locator('a[href="/explore"]').click();
    await expect(page).toHaveURL(/\/explore$/);
    await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute("href", "/explore");
  });
});

test.describe("홈 키비주얼", () => {
  test("모바일은 세로 포스터 2:3, 데스크톱은 백드롭 16:9에 가깝게", async ({ page }, testInfo) => {
    await page.goto("/");
    const hero = page.locator("#home-hero");
    await expect(hero).toBeVisible();
    const box = (await hero.boundingBox())!;
    const img = hero.locator("picture img");
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const src = decodeURIComponent(await img.evaluate((el: HTMLImageElement) => el.currentSrc));

    if (isMobile(testInfo)) {
      expect(box.height / box.width).toBeCloseTo(1.5, 1);
      expect(src).toContain("/w780/"); // 포스터만 받는다
    } else {
      // 1440×900에서는 75vh 상한(675px)에 걸려 16:9(1.78)보다 약간 넓다
      expect(box.width / box.height).toBeGreaterThan(1.7);
      expect(box.width / box.height).toBeLessThan(2.0);
      expect(box.width).toBeGreaterThanOrEqual(1280); // 상한 때문에 폭이 줄면 안 된다
      expect(src).toContain("/w1280/"); // 백드롭만 받는다
    }
  });
});
