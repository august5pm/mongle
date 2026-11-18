import { expect, test } from "@playwright/test";
import { DEFAULT_AFTER_LOGIN, safeNextPath } from "../src/lib/safe-redirect";

// 로그인 뒤 `?next=`로 다른 사이트에 보내지 못하게 (오픈 리다이렉트)
test.describe("safeNextPath", () => {
  test("같은 사이트 경로는 그대로", () => {
    expect(safeNextPath("/journal/new?mediaId=tmdb-movie-1")).toBe("/journal/new?mediaId=tmdb-movie-1");
    expect(safeNextPath("/stats")).toBe("/stats");
    expect(safeNextPath("/movie/hero-1#cast")).toBe("/movie/hero-1#cast");
  });

  test("다른 호스트로 바뀌는 값은 기본 경로로", () => {
    for (const bad of [
      ".evil.com",
      "@evil.com",
      "//evil.com",
      "/\\evil.com",
      "/\t/evil.com",
      "https://evil.com",
      "javascript:alert(1)",
      "evil.com",
      "",
      null,
      undefined,
    ]) {
      expect(safeNextPath(bad), String(bad)).toBe(DEFAULT_AFTER_LOGIN);
    }
  });
});
