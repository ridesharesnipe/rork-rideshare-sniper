import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

// Define a strong validation schema for signup
const signupSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(/^[A-Za-z\s\-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
});

// Define user type for mock database
interface MockUser {
  id: string;
  email: string;
  name: string;
}

// Define mock database type with string index signature
interface MockUserDatabase {
  [email: string]: MockUser;
}

export default publicProcedure
  .input(signupSchema)
  .mutation(async ({ input }) => {
    try {
      console.log('🔄 Backend signup attempt for:', input.email);
      
      // Validate email format first
      if (!input.email.includes('@') || !input.email.includes('.')) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter a valid email address",
        });
      }
      
      // Mock user database with proper typing
      const mockUsers: MockUserDatabase = {
        "demo@example.com": {
          id: "user-123",
          email: "demo@example.com",
          name: "Demo User",
        },
        "taken@example.com": {
          id: "user-456",
          email: "taken@example.com",
          name: "Taken User",
        }
      };
      
      // Check if email is already taken
      if (mockUsers[input.email.toLowerCase()]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a token (in a real app, this would be a JWT with proper expiration)
      const token = "mock-jwt-token-" + Date.now();
      
      // Create a user ID (in a real app, this would come from the database)
      const userId = "user-" + Date.now();
      
      // Log the signup for security auditing
      console.log(`✅ Backend: New user created: ${input.email}`);
      
      return {
        user: {
          id: userId,
          email: input.email,
          name: input.name,
        },
        token,
        success: true,
        message: "Account created successfully"
      };
    } catch (error) {
      // Log the error but don't expose details to the client
      console.error("❌ Backend signup error:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during signup",
      });
    }
  });