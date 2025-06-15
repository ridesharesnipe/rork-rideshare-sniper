import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

// Define a validation schema for login
const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
});

// Define user type for mock database
interface MockUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

// Define mock database type with string index signature
interface MockUserDatabase {
  [email: string]: MockUser;
}

export default publicProcedure
  .input(loginSchema)
  .mutation(async ({ input }) => {
    try {
      console.log('🔄 Backend login attempt for:', input.email);
      
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
          password: "password123",
        },
        "test@example.com": {
          id: "user-456",
          email: "test@example.com",
          name: "Test User",
          password: "test123",
        }
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user exists
      const user = mockUsers[input.email.toLowerCase()];
      
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      
      // Check password
      if (user.password !== input.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      
      // Generate a token (in a real app, this would be a JWT with proper expiration)
      const token = "mock-jwt-token-" + Date.now();
      
      // Log the login for security auditing
      console.log(`✅ Backend: User logged in: ${user.email}`);
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
        success: true,
        message: "Login successful"
      };
    } catch (error) {
      // Log the error but don't expose details to the client
      console.error("❌ Backend login error:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during login",
      });
    }
  });