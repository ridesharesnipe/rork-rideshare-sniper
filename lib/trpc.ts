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

// Maximum number of retries for network requests
const MAX_RETRIES = 2;

// Create a client with better error handling, timeout and retry logic
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
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        let retries = 0;
        
        while (retries <= MAX_RETRIES) {
          try {
            console.log(`Fetching from: ${url}${retries > 0 ? ` (retry ${retries})` : ''}`);
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
              
              // Don't retry for client errors (4xx)
              if (response.status >= 400 && response.status < 500) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              
              // For server errors (5xx), retry if we haven't exceeded max retries
              if (retries < MAX_RETRIES) {
                retries++;
                // Exponential backoff: 500ms, 1000ms, 2000ms, etc.
                await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retries - 1)));
                continue;
              }
              
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
              // For network errors, retry if we haven't exceeded max retries
              if (retries < MAX_RETRIES) {
                retries++;
                // Exponential backoff: 500ms, 1000ms, 2000ms, etc.
                await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, retries - 1)));
                continue;
              }
              
              throw new Error('Network connection failed. Please check your internet connection.');
            }
            
            throw error;
          }
        }
        
        // This should never be reached due to the throws above, but TypeScript needs it
        throw new Error('Maximum retries exceeded');
      },
    }),
  ],
});