import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/spotify/getAccessToken";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type");

  if (!query) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 },
    );
  }

  if (!type) {
    return NextResponse.json({ error: "Missing search type" }, { status: 400 });
  }

  if (!query && !type) {
    return NextResponse.json(
      { error: "Missing search query & search type" },
      { status: 400 },
    );
  }

  const accessToken = await getAccessToken();
  const searchUrl = new URL(process.env.SPOTIFY_SEARCH_ENDPOINT!);
  searchUrl.searchParams.append("q", query);
  searchUrl.searchParams.append("type", type);

  const response = await fetch(searchUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // NOTE: check if the response is handled correctly, if not return error.
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to search Spotify" },
      { status: response.status },
    );
  }

  // NOTE: currently just using the SpotifyApi types provided by DefinitelyTyped since I don't expect
  // these API's to change frequently. We could add a zod validation schema to validate at runtime if the response matches what
  // we expect, so that if the API response has changed we will catch it.
  const data: SpotifyApi.SearchResponse = await response.json();
  return NextResponse.json(data);
}
