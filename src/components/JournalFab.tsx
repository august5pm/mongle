"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import { useAuthUser } from "@/lib/auth-user";

export function JournalFab() {
  const pathname = usePathname();
  const [showOnScroll, setShowOnScroll] = useState(true);
  const { user } = useAuthUser();
  const isArchive = pathname === "/archive";

  useEffect(() => {
    if (!isArchive) return;

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowOnScroll(y < 48 || y < lastY);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isArchive]);

  if (!isArchive) return null;

  const href = user
    ? "/journal/new"
    : `/login?next=${encodeURIComponent("/journal/new")}`;

  return (
    <Link
      href={href}
      aria-label="새 몽글 쓰기"
      className={`accent-fill fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-5 z-40 md:bottom-8 md:right-8 flex h-14 w-14 items-center justify-center rounded-full transition-[opacity,transform] duration-base ${
        showOnScroll
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <PenLine size={22} strokeWidth={2} />
    </Link>
  );
}
