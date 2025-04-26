"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// NOTE: we place this outside of the QueryProvider so that we do not instantiate a new query client on
// every rerender.
const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
