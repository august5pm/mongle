"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_TABS, isTabActive } from "@/components/nav-tabs";

/** 모바일 전용 하단 탭바 — 데스크톱(md+)에서는 TopAppBar 안의 탭을 쓴다 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="vt-app-tabbar chrome-glass fixed inset-x-0 bottom-0 z-50 rounded-none border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] shadow-none md:hidden"
    >
      <ul className="mx-auto flex h-14 max-w-lg items-stretch">
        {NAV_TABS.map(({ href, label, icon: Icon }) => {
          const active = isTabActive(pathname, href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 transition-colors duration-fast ${
                  active
                    ? "text-primary"
                    : "text-on-surface-variant/70 hover:text-on-surface"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                <span className="text-[10px] font-semibold leading-none">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
