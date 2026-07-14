"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Home, Compass, Sparkles, UserRound } from "lucide-react";

const tabs = [
  { href: "/", label: "홈", icon: Home },
  { href: "/explore", label: "탐색", icon: Compass },
  { href: "/archive", label: "저널", icon: Sparkles },
  { href: "/profile", label: "프로필", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);
  const compactRef = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (Math.abs(delta) < 8) return;

      let next = compactRef.current;
      if (y < 56) {
        next = false;
      } else if (delta > 0) {
        next = true;
      } else {
        next = false;
      }

      if (next !== compactRef.current) {
        compactRef.current = next;
        setCompact(next);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center transition-[padding] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        compact
          ? "bottom-[max(0.85rem,env(safe-area-inset-bottom))] px-8"
          : "bottom-[max(0.45rem,env(safe-area-inset-bottom))] px-3"
      }`}
    >
      <nav
        className={`pointer-events-auto glass-panel spec-shine flex w-full max-w-lg items-end justify-between transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          compact
            ? "gap-0 rounded-[1.85rem] px-1.5 py-1.5"
            : "gap-0 rounded-[1.5rem] px-2 py-2"
        }`}
        style={{
          maxWidth: compact ? "17.5rem" : "32rem",
        }}
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center justify-center rounded-[1.15rem] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                compact ? "px-1 py-2" : "px-1 py-2.5"
              } ${
                active
                  ? "pearl-clay active-nav-glow text-[#2a3038]"
                  : "text-on-surface-variant/85 hover:text-primary"
              }`}
            >
              <Icon
                size={compact ? 20 : 22}
                strokeWidth={active ? 2.2 : 1.75}
                fill={active ? "currentColor" : "none"}
                className="transition-[width,height,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              />
              <span
                className={`origin-top tracking-wide transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  compact
                    ? "mt-0 max-h-0 scale-90 text-[10px] leading-none opacity-0"
                    : "mt-1 max-h-5 scale-100 text-[11px] font-semibold leading-none opacity-100"
                }`}
              >
                {label}
              </span>
              {active && compact ? (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#2a3038]/70" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
