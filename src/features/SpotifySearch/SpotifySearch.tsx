"use client";
import { useSpotifySearchMutation } from "@/queries/useSpotifySearch";
import { Overview } from "./components/Overview/Overview";
import SpeechToTextInput from "./components/SpeechToTextInput/SpeechToTextInput";
import { useSearchParams } from "next/navigation";

export const SpotifySearch = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const searchTypeParam = searchParams.get("type") || "";
  const { data, isPending, isError } = useSpotifySearchMutation(
    queryParam,
    searchTypeParam,
  );

  return (
    <div className="flex flex-col gap-10">
      <SpeechToTextInput />
      <Overview data={data} isPending={isPending} isError={isError} />
    </div>
  );
};
