import { QueryClient } from '@tanstack/react-query';

// Central singleton QueryClient so non-component modules (e.g. DataContext) can invalidate queries.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
