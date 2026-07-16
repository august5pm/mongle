import { NextResponse } from "next/server";
import { isTmdbConfigured, searchTmdb } from "@/lib/tmdb-api";

export async function GET(request: Request) {
  if (!isTmdbConfigured()) {
    return NextResponse.json(
      { error: "TMDB_API_KEY가 없습니다.", results: [] },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTmdb(q);
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "검색 실패",
        results: [],
      },
      { status: 500 },
    );
  }
}
