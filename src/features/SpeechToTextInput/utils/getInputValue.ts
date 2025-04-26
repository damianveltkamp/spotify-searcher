export const getInputValue = (
  isListening: boolean,
  transcript: string,
  interimTranscript: string,
  inputValue: string,
) => {
  if (isListening) {
    return interimTranscript;
  }

  if (!isListening && transcript.length) {
    return transcript;
  }

  return inputValue;
};
