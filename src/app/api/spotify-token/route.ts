import { NextResponse } from "next/server";
import { SPOTIFY_ACCESS_TOKEN_COOKIE_KEY } from "@/constants/spotify";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const tokenEndpoint = process.env.SPOTIFY_TOKEN_ENDPOINT!;

  // NOTE: in order to authorize we need to provide a base64 encoded string of our client id + secret.
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  // NOTE: check if the response is handled correctly, if not return error.
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to get the access token from Spotify" },
      { status: response.status },
    );
  }

  const data = await response.json();

  // NOTE: we save the access token to a cookie so we do not have to fetch an
  // access token every time.
  const nextResponse = NextResponse.json({ access_token: data.access_token });
  nextResponse.cookies.set(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600,
  });

  return nextResponse;
}
