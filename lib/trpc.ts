import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  try {
    // Check for environment variable first
    if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
      return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    }
    
    // Development fallback URLs
    if (__DEV__) {
      // For Expo development
      return "http://localhost:8081";
    }
    
    // Production fallback - update this for your actual production URL
    return "https://api.ridesharesniper.com";
  } catch (error) {
    console.error("Error getting base URL:", error);
    return "http://localhost:8081"; // Safe fallback for development
  }
};

// Create a client with better error handling and timeout
export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) => 
        __DEV__ || 
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      // Add timeout and better error handling
      fetch: async (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
          console.log(`Fetching from: ${url}`);
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              ...options?.headers,
            },
          });
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.error(`HTTP error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          return response;
        } catch (error: any) {
          clearTimeout(timeoutId);
          console.error('tRPC fetch error:', error);
          
          // Provide more helpful error messages for common network issues
          if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
          }
          
          if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
            throw new Error('Network connection failed. Please check your internet connection.');
          }
          
          throw error;
        }
      },
    }),
  ],
});