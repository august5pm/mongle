import type { Metadata } from "next";
import { ArchiveClient } from "@/components/ArchiveClient";

export const metadata: Metadata = {
  title: "아카이브",
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
