import { expect, test } from "@playwright/test";

test.describe("몽글 소개", () => {
  test("푸터에서 들어가 소개·감정·안내를 본다", async ({ page }) => {
    await page.goto("/explore");
    await page.locator("footer").getByRole("link", { name: "몽글 소개" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page).toHaveTitle(/몽글 소개/);
    await expect(page.locator("main").getByRole("heading", { level: 1 })).toContainText("감정을 기록하는 곳");

    await expect(page.getByRole("heading", { name: "이렇게 써요" })).toBeVisible();
    await expect(page.locator("[data-emotion]")).toHaveCount(4);
    // 기록이 공개된다는 점을 미리 알린다
    await expect(page.getByText("‘모두의 몽글’에 공개돼요")).toBeVisible();
    await expect(page.locator('main dl a[href="https://www.themoviedb.org/"]')).toHaveCount(1);
  });

  test("공유 미리보기는 소개 주소", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /\/about$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "몽글 소개");
  });
});
