"use client";
import React, { useState, useEffect, useRef } from "react";
import { getInputValue } from "./utils/getInputValue";
import { tailwindMerge } from "@/utils/tailwind/tailwindMerge";
import { Mic, MicOff } from "lucide-react";
import { useSpotifySearchMutation } from "@/queries/useSpotifySearch";

/**
 * Hook that let's you leverage the speech recognition API
 */
const useSpeechRecognition = () => {
  const [isSupportedFeature, setIsSupportedFeature] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition>(null);

  // NOTE: we make use of useEffect so that we can setup our recognition API
  // and pass it along via the recognitionRef for consumption outside of the useEffect
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Your browser does not support speech recognition API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";

      // NOTE: The for loop below makes sure that we loop over all the results, this ensures we get the most
      // acurate transcript. event.resultIndex is the first result that changed since the last time onresult fired.
      // So we’re only looking at new or updated results.
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          setTranscript((prev) => prev + result[0].transcript + " ");
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
    setIsSupportedFeature(true);
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // NOTE: we reset the recognition state every time we start with a fresh recording.
      // if we don't reset the state we will append the current recognised text to the previosly
      // recognized text.
      resetRecognitionState();
      recognitionRef.current.start();
    }

    setIsListening((prev) => !prev);
  };

  const resetRecognitionState = () => {
    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
  };

  return {
    isSupportedFeature,
    transcript,
    interimTranscript,
    isListening,
    toggleListening,
    resetRecognitionState,
  };
};

export const SpeechToTextInput = () => {
  const {
    isSupportedFeature,
    transcript,
    interimTranscript,
    toggleListening,
    isListening,
    resetRecognitionState,
  } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState("");
  const { mutate } = useSpotifySearchMutation();

  return (
    <div className="p-4 rounded shadow max-w-md mx-auto mt-10 bg-white">
      <form
        className="flex gap-4 flex-col"
        action={async (formData) => {
          mutate(formData);
        }}
      >
        <fieldset className="flex gap-4">
          {/* NOTE: I know that I should move this search-type logic into it's own separate component. */}
          {/* If this is still in the codebase like this that means I ran out of time this weekend. */}
          <label className="flex flex-col items-start">
            <span>Artist</span>
            <input type="radio" name="search-type" value="artist" />
          </label>
          <label className="flex flex-col items-start">
            <span>Album</span>
            <input type="radio" name="search-type" value="album" />
          </label>
          <label className="flex flex-col items-start">
            <span>Song</span>
            <input type="radio" name="search-type" value="track" />
          </label>
        </fieldset>
        <div className="relative ">
          <input
            name="query"
            className="w-full p-2 border rounded bg-gray-100 whitespace-pre-wrap"
            value={getInputValue(
              isListening,
              transcript,
              interimTranscript,
              inputValue,
            )}
            onChange={(e) => {
              resetRecognitionState();
              setInputValue(e.target.value);
            }}
          />
          {isSupportedFeature && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                toggleListening();
              }}
              // isListening ? "bg-red-500" : "bg-green-500"
              className={tailwindMerge("absolute right-0 h-full p-2", {
                "bg-red-500": !isListening,
                "bg-green-500": isListening,
              })}
            >
              {isListening ? <MicOff /> : <Mic />}
            </button>
          )}
        </div>
        <button
          className="hover:cursor-pointer bg-gray-100 p-2 w-full"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SpeechToTextInput;
