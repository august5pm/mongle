import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type LikeState = {
  count: number;
  likedByMe: boolean;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isJournalUuid(id: string) {
  return UUID_RE.test(id);
}

export async function fetchLikeStates(
  journalIds: string[],
): Promise<Record<string, LikeState>> {
  const ids = Array.from(new Set(journalIds.filter(isJournalUuid)));
  const empty: Record<string, LikeState> = {};
  ids.forEach((id) => {
    empty[id] = { count: 0, likedByMe: false };
  });
  if (!ids.length || !isSupabaseConfigured()) return empty;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("journal_likes")
    .select("journal_id, user_id")
    .in("journal_id", ids);

  if (error) throw error;

  const result = { ...empty };
  for (const row of data ?? []) {
    const jid = row.journal_id as string;
    if (!result[jid]) result[jid] = { count: 0, likedByMe: false };
    result[jid].count += 1;
    if (user && row.user_id === user.id) result[jid].likedByMe = true;
  }
  return result;
}

export async function toggleJournalLike(
  journalId: string,
): Promise<LikeState> {
  if (!isJournalUuid(journalId)) {
    throw new Error("좋아요할 수 없는 기록입니다.");
  }
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase가 설정되지 않았습니다.");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: existing, error: findError } = await supabase
    .from("journal_likes")
    .select("id")
    .eq("journal_id", journalId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    const { error } = await supabase
      .from("journal_likes")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("journal_likes").insert({
      journal_id: journalId,
      user_id: user.id,
    });
    if (error) throw error;
  }

  const { count, error: countError } = await supabase
    .from("journal_likes")
    .select("*", { count: "exact", head: true })
    .eq("journal_id", journalId);

  if (countError) throw countError;

  return {
    count: count ?? 0,
    likedByMe: !existing,
  };
}
