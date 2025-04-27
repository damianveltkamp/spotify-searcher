import { SpotifySearch } from "@/features/SpotifySearch/SpotifySearch";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <main>
        {/* NOTE: adding suspense here since we are using the useSearchParams functionality */}
        {/* inside the SpotifySearch feature. If we do not add Suspense here we get an error when building */}
        {/* the project. */}
        <Suspense fallback={<div>Loading spotify search</div>}>
          <SpotifySearch />
        </Suspense>
      </main>
    </div>
  );
}
