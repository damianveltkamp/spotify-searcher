"use client";
import React, { useState, useEffect, useRef } from "react";
import { getInputValue } from "./utils/getInputValue";
import { tailwindMerge } from "@/utils/tailwind/tailwindMerge";
import { Mic, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Radio } from "./components/Radio";

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
    // NOTE: we transform the string to lowercase so that we have better caching with tanstack query.
    // sometimes when doing the text to speech for the same word it capitalizes, so we should normalize to lowercase.
    transcript: transcript.toLowerCase(),
    interimTranscript: interimTranscript.toLowerCase(),
    isListening,
    toggleListening,
    resetRecognitionState,
  };
};

export const SpeechToTextInput = () => {
  const router = useRouter();
  const {
    isSupportedFeature,
    transcript,
    interimTranscript,
    toggleListening,
    isListening,
    resetRecognitionState,
  } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="w-full p-4 rounded shadow max-w-md mx-auto mt-10 bg-white">
      <form
        className="flex gap-4 flex-col"
        action={async (formData) => {
          const query = formData.get("query") as string;
          const searchType = formData.get("search-type") as string;
          router.push(
            `/?q=${encodeURIComponent(query)}&type=${encodeURIComponent(searchType)}`,
          );

          // NOTE: after submitting the form I want to clear the input fields, so that the user could start a fresh
          // search right away without having to clear any fields.
          setInputValue("");
          resetRecognitionState();
        }}
      >
        <fieldset className="flex gap-4">
          <Radio name="search-type" label="Artist" value="artist" />
          <Radio name="search-type" label="Album" value="album" />
          <Radio name="search-type" label="Song" value="track" />
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
              className={tailwindMerge("absolute right-0 h-full p-2", {
                transparent: !isListening,
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
        <button
          className="hover:cursor-pointer bg-red-500 p-2 w-full"
          type="button"
          onClick={() => {
            router.push("/");
          }}
        >
          Clear search
        </button>
      </form>
    </div>
  );
};

export default SpeechToTextInput;
