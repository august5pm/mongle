import type { Metadata } from "next";
import { Suspense } from "react";
import { JournalComposer } from "@/components/JournalComposer";

export const metadata: Metadata = {
  title: "새 몽글",
};

export default function NewJournalPage() {
  return (
    <Suspense
      fallback={
        <div className="px-container-mobile pt-28 text-on-surface-variant">
          기록을 준비하는 중…
        </div>
      }
    >
      <JournalComposer />
    </Suspense>
  );
}
