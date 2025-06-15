import { publicProcedure } from "@/backend/trpc/create-context";
import { z } from "zod";

const hiInputSchema = z.object({
  name: z.string().optional(),
});

export default publicProcedure
  .input(hiInputSchema)
  .query(({ input }) => {
    const name = input?.name || "World";
    
    console.log(`👋 Backend: Hi endpoint called with name: ${name}`);
    
    return {
      message: `Hello ${name}!`,
      timestamp: new Date().toISOString(),
      status: "success"
    };
  });