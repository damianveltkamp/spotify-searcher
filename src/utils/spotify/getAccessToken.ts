import { SPOTIFY_ACCESS_TOKEN_COOKIE_KEY } from "@/constants/spotify";
import { cookies } from "next/headers";

/**
 * This function checks if we already have an access token saved inside of our cookies.
 * If there is a token present inside the cookies it returns the token from the cookies.
 * If there is no token present we fetch a new token.
 */
export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY);

  if (accessTokenCookie) {
    return accessTokenCookie.value;
  }

  const response = await fetch(`${process.env.SITE_URL}/api/spotify-token`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  return data.access_token;
};
