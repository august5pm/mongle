/** 로그인 뒤 돌아갈 경로의 기본값 */
export const DEFAULT_AFTER_LOGIN = "/archive";

/**
 * `?next=` 값을 같은 사이트 안의 경로로만 받아들인다 (오픈 리다이렉트 방지).
 * `${origin}${next}`에 `.evil.com`·`@evil.com`이 붙으면 다른 호스트가 되고,
 * `//evil.com`·`/\evil.com`은 브라우저가 프로토콜 상대 주소로 읽는다.
 */
export function safeNextPath(
  next: string | null | undefined,
  fallback = DEFAULT_AFTER_LOGIN,
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  // 제어 문자·공백으로 파서를 속이는 경우까지 URL 파서로 한 번 더 확인
  try {
    const base = "https://mongle.invalid";
    const url = new URL(next, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
