import { useQuery } from "@tanstack/react-query";

export const useSpotifySearchQuery = (query: string, searchType: string) => {
  return useQuery({
    queryKey: ["spotifySearch", query, searchType],
    queryFn: async () => {
      const res = await fetch(
        // NOTE: we make sure to encode potential weird characters to UTF8 using encodeURIComponent.
        `/api/spotify-search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(searchType)}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      // TODO: fix the typescript type of this data object by doing some validation on it.
      // Hopefully will have time to pick this up tomorrow.
      const data = await res.json();

      return data;
    },
  });
};
