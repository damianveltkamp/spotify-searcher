type CardProps = {
  name: string;
};

const Card = ({ name }: CardProps) => {
  return <div className="bg-blue-400 rounded-lg p-4">{name}</div>;
};

type TrackItem = {
  itemType: "track";
  item: SpotifyApi.TrackObjectFull;
};

type AlbumItem = {
  itemType: "album";
  item: SpotifyApi.AlbumObjectSimplified;
};

type ArtistItem = {
  itemType: "artist";
  item: SpotifyApi.ArtistObjectFull;
};

// NOTE: we use a discriminated uninon here since the data returned from the search API
// can be different when searching for tracks, albums, or artists.
type OverviewCardProps = TrackItem | AlbumItem | ArtistItem;

export const OverviewCard = ({ item, itemType }: OverviewCardProps) => {
  // NOTE: since we are using the discuminated union above we get correct type completion
  // based on the item type we check on.
  if (itemType === "track") {
    return <Card name={item.name} />;
  }

  if (itemType === "artist") {
    return <Card name={item.name} />;
  }

  if (itemType === "album") {
    return <Card name={item.name} />;
  }
};
