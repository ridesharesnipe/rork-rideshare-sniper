import { publicProcedure } from "../../create-context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Define validation schemas
const passwordRecoverySchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short"),
  resetCode: z.string()
    .length(6, "Reset code must be 6 digits")
    .regex(/^\d+$/, "Reset code must contain only digits"),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters"),
  recoveryType: z.literal("password")
});

const emailRecoverySchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  verificationCode: z.string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only digits"),
  recoveryType: z.literal("email")
});

// Combined schema with discriminated union
const recoverySchema = z.discriminatedUnion("recoveryType", [
  passwordRecoverySchema,
  emailRecoverySchema
]);

// Define user type for mock database
interface MockUser {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
}

// Define mock database type with string index signature
interface MockUserDatabase {
  [email: string]: MockUser;
}

export default publicProcedure
  .input(recoverySchema)
  .mutation(async ({ input }) => {
    try {
      console.log('🔄 Backend recovery attempt:', input.recoveryType);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user database with proper typing
      const mockUsers: MockUserDatabase = {
        "demo@example.com": {
          id: "user-123",
          email: "demo@example.com",
          name: "Demo User",
          phoneNumber: "1234567890"
        },
        "test@example.com": {
          id: "user-456",
          email: "test@example.com",
          name: "Test User",
          phoneNumber: "0987654321"
        }
      };

      if (input.recoveryType === "password") {
        // Check if email exists
        const user = mockUsers[input.email.toLowerCase()];
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email not found",
          });
        }

        // In a real app, you would verify the reset code against a stored code
        // For demo purposes, we'll accept any 6-digit code
        if (input.resetCode !== "123456") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid reset code. For demo, use 123456",
          });
        }

        console.log(`✅ Backend: Password reset for: ${input.email}`);

        return {
          success: true,
          message: "Password has been reset successfully",
        };
      } else {
        // Find users with matching phone number
        const matchingUser = Object.values(mockUsers).find(
          user => user.phoneNumber === input.phoneNumber
        );
        
        // In a real app, you would verify the verification code
        // For demo purposes, we'll accept any 6-digit code
        if (input.verificationCode !== "123456") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid verification code. For demo, use 123456",
          });
        }
        
        if (matchingUser) {
          console.log(`✅ Backend: Email recovered for phone: ${input.phoneNumber}`);
          return {
            success: true,
            email: matchingUser.email,
            message: "Email has been recovered successfully",
          };
        }
        
        // For demo purposes, always return the demo user if no match
        console.log(`✅ Backend: Email recovered (demo) for phone: ${input.phoneNumber}`);
        return {
          success: true,
          email: "demo@example.com",
          message: "Email has been recovered successfully",
        };
      }
    } catch (error) {
      // Log the error but don't expose details to the client
      console.error("❌ Backend recovery error:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during recovery",
      });
    }
  });