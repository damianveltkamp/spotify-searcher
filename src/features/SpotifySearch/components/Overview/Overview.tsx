"use client";

type OverviewProps = {
  data: unknown;
  isPending: boolean;
  isError: boolean;
};

export const Overview = ({ data, isPending, isError }: OverviewProps) => {
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
      {Object.entries(data).map(([key, value]) => {
        if (!value.items) return;

        return value.items.map((item) => {
          return (
            <div className="bg-blue-400 rounded-lg p-4" key={item.id}>
              {item.name}
            </div>
          );
        });
      })}
    </div>
  );
};
