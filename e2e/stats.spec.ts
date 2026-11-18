import { expect, test } from "@playwright/test";
import { collectPageErrors } from "./helpers";

// Supabase 없이 돌면 '모두의 몽글'은 시드 기록으로 채워진다
test.describe("감정 통계", () => {
  test("감정 분포 · 월별 흐름 · 장르가 그려진다", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto("/stats");
    await expect(page.getByRole("heading", { name: "감정 통계", level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/감정 통계/);

    // 로그인 전에는 '모두의 몽글'만
    await expect(page.getByRole("tab", { name: "모두의 몽글" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "내 몽글" })).toBeDisabled();

    const shares = page.getByRole("list", { name: "감정별 기록 수" }).locator("li");
    await expect(shares).toHaveCount(4);
    await expect(shares.first()).toContainText(/\d+개 · \d+%/);

    // 이번 달까지 최근 6개월 막대
    const columns = page.locator("[data-month]");
    await expect(columns).toHaveCount(6);
    await expect(page.getByRole("list", { name: "장르별 기록 수" }).locator("li").first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("막대에 올리면 그 달의 감정별 수가 뜨고, 표로도 볼 수 있다", async ({ page }) => {
    await page.goto("/stats");
    const column = page.locator("[data-month]").last();
    const label = (await column.getAttribute("aria-label"))!.split(" ")[0];

    await column.hover();
    const tooltip = page.getByTestId("monthly-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(label);
    await expect(tooltip.locator("li")).toHaveCount(4);

    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();

    await page.getByRole("button", { name: "표로 보기" }).click();
    const table = page.getByRole("table", { name: "최근 6개월 월별 감정 기록 수" });
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr")).toHaveCount(6);
    await page.getByRole("button", { name: "차트로 보기" }).click();
    await expect(page.locator("[data-month]")).toHaveCount(6);
  });

  test("아카이브에서 들어갈 수 있다", async ({ page }) => {
    await page.goto("/archive");
    await page.getByRole("link", { name: "감정 통계 보기 →" }).click();
    await expect(page).toHaveURL(/\/stats$/);
    await expect(page.getByRole("heading", { name: "감정 통계", level: 1 })).toBeVisible();
  });
});
