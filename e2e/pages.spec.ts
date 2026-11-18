import { expect, test } from "@playwright/test";
import { MOCK_MEDIA_ID, collectPageErrors } from "./helpers";

test.describe("페이지 렌더링", () => {
  for (const path of ["/", "/explore", "/archive", `/movie/${MOCK_MEDIA_ID}`, "/profile", "/login", "/stats", "/about"]) {
    test(`${path} 가 예외 없이 열린다`, async ({ page }) => {
      const errors = collectPageErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("main#main-content")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test("없는 주소는 404 화면", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "찾는 장면이 없어요" })).toBeVisible();
    await expect(page.getByRole("link", { name: "홈으로" })).toBeVisible();
  });

  test("없는 작품은 작품용 404 화면", async ({ page }) => {
    const res = await page.goto("/movie/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "이 작품을 찾을 수 없어요" })).toBeVisible();
    await expect(page).toHaveTitle(/작품을 찾을 수 없어요/);
  });

  test("리다이렉트 경로", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(/\/explore$/);
    await page.goto(`/detail/${MOCK_MEDIA_ID}`);
    await expect(page).toHaveURL(new RegExp(`/movie/${MOCK_MEDIA_ID}$`));
  });
});

test.describe("TMDB 출처 표기", () => {
  test("푸터에 로고와 고지문이 있다", async ({ page }) => {
    await page.goto("/profile");
    const footer = page.locator("footer");
    await expect(
      footer.getByText(
        "This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.",
      ),
    ).toBeVisible();
    const logo = footer.locator('img[src*="tmdb-logo"]');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(footer.locator('a[href="https://www.themoviedb.org/"]')).toHaveCount(1);
  });
});

test.describe("공유 미리보기 (OG)", () => {
  const og = (page: import("@playwright/test").Page, prop: string) =>
    page.locator(`meta[property="og:${prop}"]`).getAttribute("content");

  test("공통 페이지는 브랜드 이미지, og:url 없음", async ({ page }) => {
    await page.goto("/explore");
    expect(await og(page, "image")).toMatch(/^https?:\/\/.+\/og-default\.png$/);
    expect(await og(page, "site_name")).toBe("몽글");
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  });

  test("기본 OG 이미지 파일이 제공된다", async ({ request }) => {
    const res = await request.get("/og-default.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("상세는 작품 이미지·제목·주소", async ({ page }) => {
    await page.goto(`/movie/${MOCK_MEDIA_ID}`);
    expect(await og(page, "title")).toMatch(/ · 몽글$/);
    expect(await og(page, "type")).toMatch(/^video\./);
    expect(await og(page, "url")).toMatch(new RegExp(`/movie/${MOCK_MEDIA_ID}$`));
    // 리다이렉트 없는 공식 CDN이어야 카카오톡 등 크롤러가 가져간다
    expect(await og(page, "image")).toMatch(/^https:\/\/image\.tmdb\.org\/t\/p\//);
  });
});
