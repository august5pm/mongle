import {
  journalEntries as seedEntries,
  sentiments,
  getMediaById,
  type JournalEntry,
  type Sentiment,
} from "@/data/mock";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type JournalRow = {
  id: string;
  user_id: string;
  media_id: string;
  emotion: string;
  emotion_label: string;
  note: string;
  genre_label: string;
  bubble_tone: JournalEntry["bubbleTone"];
  created_at: string;
};

export const bubbleByEmotion: Record<Sentiment, JournalEntry["bubbleTone"]> = {
  Dreamy: "primary",
  Warm: "secondary",
  Intense: "surface",
  Soft: "tertiary",
};

export function sentimentLabel(emotion: Sentiment): string {
  return sentiments.find((s) => s.id === emotion)?.label ?? emotion;
}

export function formatJournalDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function formatRecordedAgo(isoOrDate: string | Date): string {
  const d =
    typeof isoOrDate === "string" ? parseLooseDate(isoOrDate) : isoOrDate;
  if (!d) return "기록됨";
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return "오늘 기록";
  if (days === 1) return "어제 기록";
  if (days < 7) return `${days}일 전 기록`;
  if (days < 30) return `${Math.floor(days / 7)}주 전 기록`;
  return `${Math.floor(days / 30)}달 전 기록`;
}

function parseLooseDate(value: string): Date | null {
  const dotted = value.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (dotted) {
    return new Date(
      Number(dotted[1]),
      Number(dotted[2]) - 1,
      Number(dotted[3]),
    );
  }
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t);
}

export function rowToEntry(row: JournalRow): JournalEntry {
  const created = new Date(row.created_at);
  return {
    id: row.id,
    mediaId: row.media_id,
    emotion: row.emotion as Sentiment,
    emotionLabel: row.emotion_label,
    note: row.note,
    date: formatJournalDate(created),
    recordedAgo: formatRecordedAgo(created),
    genreLabel: row.genre_label,
    bubbleTone: row.bubble_tone,
  };
}

export function getSeedJournals(): JournalEntry[] {
  return seedEntries.map((e) => ({
    ...e,
    recordedAgo: formatRecordedAgo(e.date),
  }));
}

export async function fetchMyJournals(): Promise<JournalEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as JournalRow[] | null)?.map(rowToEntry) ?? [];
}

export async function addJournalEntry(input: {
  mediaId: string;
  emotion: Sentiment;
  note: string;
}): Promise<JournalEntry> {
  const media = getMediaById(input.mediaId);
  if (!media) throw new Error("작품을 찾을 수 없습니다.");
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase가 설정되지 않았습니다.");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const payload = {
    user_id: user.id,
    media_id: media.id,
    emotion: input.emotion,
    emotion_label: sentimentLabel(input.emotion),
    note: input.note.trim(),
    genre_label: media.genres[0] ?? "영화",
    bubble_tone: bubbleByEmotion[input.emotion],
  };

  const { data, error } = await supabase
    .from("journals")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return rowToEntry(data as JournalRow);
}

export function computeArchiveStats(entries: JournalEntry[]) {
  const now = new Date();
  const thisMonth = entries.filter((e) => {
    const d = parseLooseDate(e.date);
    return (
      d &&
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  }).length;

  return {
    totalMongles: entries.length,
    thisMonth,
  };
}
