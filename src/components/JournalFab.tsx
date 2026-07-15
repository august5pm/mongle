"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function JournalFab() {
  const pathname = usePathname();
  const [showOnScroll, setShowOnScroll] = useState(true);
  const [user, setUser] = useState<User | null>(null);
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

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  if (!isArchive) return null;

  const href = user
    ? "/journal/new"
    : `/login?next=${encodeURIComponent("/journal/new")}`;

  return (
    <Link
      href={href}
      aria-label="새 저널 쓰기"
      className={`pearl-clay peach-glow fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
        showOnScroll
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <PenLine size={22} strokeWidth={2} />
    </Link>
  );
}
