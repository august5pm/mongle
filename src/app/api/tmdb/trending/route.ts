import { NextResponse } from "next/server";
import { isTmdbConfigured, trendingTmdb } from "@/lib/tmdb-api";

export async function GET() {
  if (!isTmdbConfigured()) {
    return NextResponse.json(
      { error: "TMDB_API_KEY가 없습니다.", results: [] },
      { status: 503 },
    );
  }

  try {
    const results = await trendingTmdb("week");
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "트렌딩 불러오기 실패",
        results: [],
      },
      { status: 500 },
    );
  }
}
