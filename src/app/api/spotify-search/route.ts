import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/utils/spotify/getAccessToken";
import { SPOTIFY_SEARCH_TYPES_LOOKUP_TABLE } from "@/constants/spotify";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type");

  // NOTE: if there is no search query provided the request is invalid, so we return 400.
  if (!query) {
    return NextResponse.json(
      { error: "Missing search query" },
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

  const data = await response.json();
  return NextResponse.json(data);
}
