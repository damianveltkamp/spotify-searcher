import { useMutation } from "@tanstack/react-query";

export const useSpotifySearchMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const query = formData.get("query") as string;
      const searchType = formData.get("search-type") as string;

      console.log("SEARCHTYPE");
      console.log(searchType);
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
