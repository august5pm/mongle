import type { MediaType } from "@/data/mock";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type WishlistRow = {
  id: string;
  user_id: string;
  media_id: string;
  title: string;
  poster_path: string | null;
  media_type: string;
  created_at: string;
};

export type WishlistInput = {
  mediaId: string;
  title: string;
  posterPath?: string;
  mediaType?: MediaType;
};

export function isWishlistConfigured() {
  return isSupabaseConfigured();
}

export async function fetchMyWishlist(): Promise<WishlistRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("wishlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as WishlistRow[];
}

export async function isInWishlist(mediaId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("media_id", mediaId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function addToWishlist(input: WishlistInput): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase가 설정되지 않았습니다.");
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase.from("wishlists").insert({
    user_id: user.id,
    media_id: input.mediaId,
    title: input.title,
    poster_path: input.posterPath ?? null,
    media_type: input.mediaType ?? "movie",
  });

  if (error) throw error;
}

export async function removeFromWishlist(mediaId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase가 설정되지 않았습니다.");
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("media_id", mediaId);

  if (error) throw error;
}

export async function toggleWishlist(
  input: WishlistInput,
): Promise<"added" | "removed"> {
  const exists = await isInWishlist(input.mediaId);
  if (exists) {
    await removeFromWishlist(input.mediaId);
    return "removed";
  }
  await addToWishlist(input);
  return "added";
}
