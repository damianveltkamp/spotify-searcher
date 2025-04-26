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

      const data = await res.json();

      return data;
    },
  });
};
