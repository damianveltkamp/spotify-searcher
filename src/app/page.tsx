import { Overview } from "@/features/Overview/Overview";
import { SpeechToTextInput } from "@/features/SpeechToTextInput/SpeechToTextInput";

export default function Home() {
  return (
    <div>
      <main>
        <SpeechToTextInput />
        <Overview />
      </main>
      <footer>Footer</footer>
    </div>
  );
}
