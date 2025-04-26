import { useSpotifySearchMutation } from "@/queries/useSpotifySearch";

export const Overview = () => {
  const { data } = useSpotifySearchMutation();

  console.log(data);
  return (
    <div>
      Spotify things go here
      {data}
    </div>
  );
};
