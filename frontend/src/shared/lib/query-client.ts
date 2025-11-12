import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1分
          gcTime: 5 * 60 * 1000, // 5分（旧cacheTime）
        },
      },
    }),
);
