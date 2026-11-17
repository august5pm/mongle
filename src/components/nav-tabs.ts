import { Compass, Home, Sparkles, UserRound } from "lucide-react";

/** 주요 메뉴 — 데스크톱은 TopAppBar 텍스트 탭, 모바일은 BottomNav 탭바에서 공유 */
export const NAV_TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/explore", label: "찾기", icon: Compass },
  { href: "/archive", label: "몽글", icon: Sparkles },
  { href: "/profile", label: "프로필", icon: UserRound },
] as const;

export function isTabActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
