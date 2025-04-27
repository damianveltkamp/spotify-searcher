"use client";

import { SPOTIFY_SEARCH_TYPES } from "@/constants/spotify";
import { OverviewCard } from "../OverviewCard/OverviewCard";

type OverviewProps = {
  data: SpotifyApi.SearchResponse | undefined;
  searchType: string;
  isPending: boolean;
  isError: boolean;
};

export const Overview = ({
  data,
  searchType,
  isPending,
  isError,
}: OverviewProps) => {
  if (isPending) {
    return <div>Loading ...</div>;
  }

  if (isError) {
    return (
      <div>Something went wrong while searching through the Spotify API</div>
    );
  }

  if (!data) return;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {Object.entries(data).map(([, value]) => {
        if (searchType === SPOTIFY_SEARCH_TYPES.ALBUM) {
          const castedValue = value as SpotifyApi.AlbumSearchResponse["albums"];
          if (!castedValue.items) return;

          return castedValue.items.map((item) => (
            <OverviewCard
              key={item.id}
              item={item}
              itemType={SPOTIFY_SEARCH_TYPES.ALBUM}
            />
          ));
        }
        if (searchType === SPOTIFY_SEARCH_TYPES.TRACK) {
          const castedValue = value as SpotifyApi.TrackSearchResponse["tracks"];
          if (!castedValue.items) return;

          return castedValue.items.map((item) => (
            <OverviewCard
              key={item.id}
              item={item}
              itemType={SPOTIFY_SEARCH_TYPES.TRACK}
            />
          ));
        }
        if (searchType === SPOTIFY_SEARCH_TYPES.ARTIST) {
          const castedValue =
            value as SpotifyApi.ArtistSearchResponse["artists"];
          if (!castedValue.items) return;

          return castedValue.items.map((item) => (
            <OverviewCard
              key={item.id}
              item={item}
              itemType={SPOTIFY_SEARCH_TYPES.ARTIST}
            />
          ));
        }

        return null;
      })}
    </div>
  );
};
