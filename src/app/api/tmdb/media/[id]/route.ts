import { NextResponse } from "next/server";
import { getMediaById } from "@/data/mock";
import { fetchTmdbMediaByAppId, isTmdbConfigured } from "@/lib/tmdb-api";

type Params = { params: { id: string } };

export async function GET(_request: Request, { params }: Params) {
  const local = getMediaById(params.id);
  if (local) {
    return NextResponse.json({ item: local });
  }

  if (!isTmdbConfigured()) {
    return NextResponse.json({ error: "not found", item: null }, { status: 404 });
  }

  try {
    const item = await fetchTmdbMediaByAppId(params.id);
    if (!item) {
      return NextResponse.json({ error: "not found", item: null }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "불러오기 실패",
        item: null,
      },
      { status: 500 },
    );
  }
}
