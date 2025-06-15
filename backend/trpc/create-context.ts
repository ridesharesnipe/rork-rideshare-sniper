import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// Simplified context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // Extract headers for potential authentication
  const authorization = opts.req.headers.get('authorization');
  
  return {
    req: opts.req,
    user: null, // We'll handle auth in a simpler way for now
    authorization,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC with proper error handling
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Don't expose stack traces in production
        stack: process.env.NODE_ENV === 'production' ? undefined : shape.data.stack,
        // Add more context for debugging
        code: error.code,
        httpStatus: shape.data.httpStatus,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Simplified protected procedure - for now just use public
// In a real app, you would validate JWT tokens here
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // For now, just pass through - in production you'd validate auth here
  return next({
    ctx: {
      ...ctx,
      // user would be extracted from JWT token
    },
  });
});