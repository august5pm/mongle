import { expect, test } from "@playwright/test";
import { isMobile, scrollThrough } from "./helpers";

test.describe("모션", () => {
  for (const path of ["/", "/explore", "/archive"]) {
    test(`${path}: 스크롤 후 등장 요소가 투명하게 남지 않는다`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForTimeout(300);
      const stuck = await page.evaluate(() => {
        const vh = innerHeight;
        return Array.from(document.querySelectorAll(".reveal"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.top < vh * 0.7 && r.bottom > vh * 0.3; // 화면 가운데에 있는 것만
          })
          .map((el) => Number(getComputedStyle(el).opacity))
          .filter((o) => o < 0.99);
      });
      expect(stuck).toEqual([]);
    });

    test(`${path}: 로드된 이미지는 모두 보인다`, async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");
      const hidden = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLImageElement>("img.media-img"))
          .filter((img) => img.complete && img.naturalWidth > 0)
          .filter((img) => img.dataset.loaded !== "true" || getComputedStyle(img).opacity !== "1")
          .map((img) => img.alt),
      );
      expect(hidden).toEqual([]);
    });
  }

  test("상단바 배경이 스크롤에 따라 진해진다", async ({ page }) => {
    await page.goto("/");
    const bg = () => page.locator(".appbar-scrim").evaluate((el) => getComputedStyle(el).backgroundColor);
    const top = await bg();
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect.poll(bg).not.toBe(top);
  });

  test("포스터 호버 시 이미지만 확대된다", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), "호버가 없는 터치 환경");
    await page.goto("/");
    const card = page.locator(".poster-card").first();
    await card.scrollIntoViewIfNeeded();
    const zoom = card.locator("[data-vt-source] > div").first();
    await card.hover();
    await expect.poll(() => zoom.evaluate((el) => getComputedStyle(el).transform)).toMatch(/^matrix\(1\.04,/);
    // 카드 자체는 움직이지 않는다
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });

  test("느린 이동에는 상단 진행 바가 나타났다 사라진다", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), "데스크톱 상단 탭으로만 검사");
    // 모든 페이지 데이터 요청(RSC, prefetch 포함)을 늦춘다.
    // prefetch를 막으면 Next가 전체 새로고침으로 이동해 버리므로 막지 않고 늦추기만 한다.
    await page.route("**/*", async (route) => {
      try {
        if (route.request().headers()["rsc"] === "1") {
          await new Promise((r) => setTimeout(r, 2000));
        }
        await route.continue();
      } catch {
        /* 페이지가 닫히며 이미 처리된 요청 */
      }
    });
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    // 하이드레이션 전에 누르면 브라우저 기본 이동이 일어나므로, 이 링크에 React가 붙었는지 확인한다
    // (window.next는 하이드레이션 전에 생겨서 부하가 걸리면 신호로 부족했다)
    await page.waitForFunction(() => {
      const a = document.querySelector("header nav a[href='/archive']");
      return Boolean(a && Object.keys(a).some((k) => k.startsWith("__reactProps")));
    });
    const bar = page.locator("div.fixed.top-0.h-\\[2px\\]");
    await page.locator("header nav a[href='/archive']").click();
    await expect.poll(() => bar.evaluate((el) => (el as HTMLElement).style.opacity)).toBe("1");
    await page.waitForURL("**/archive");
    await expect.poll(() => bar.evaluate((el) => (el as HTMLElement).style.opacity)).toBe("0");
  });
});

test.describe("움직임 줄이기 설정", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("스크롤 등장 애니메이션이 꺼지고 요소는 보인다", async ({ page }) => {
    await page.goto("/");
    const reveal = page.locator(".reveal").first();
    expect(await reveal.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    expect(await reveal.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});
