import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

// Define validation schema for profile
const profileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

// Define user profile type
interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin: string;
  profilePicture?: string;
  phoneNumber?: string;
  location?: string;
}

// Mock user profiles database
const mockProfiles: { [userId: string]: UserProfile } = {
  "user-123": {
    id: "user-123",
    email: "demo@example.com",
    name: "Demo User",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
    phoneNumber: "1234567890",
    location: "San Francisco, CA"
  },
  "user-456": {
    id: "user-456",
    email: "test@example.com",
    name: "Test User",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
    phoneNumber: "0987654321",
    location: "New York, NY"
  },
};

export default publicProcedure
  .input(profileSchema)
  .query(async ({ input }) => {
    try {
      console.log(`🔄 Backend: Getting profile for user: ${input.userId}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get user profile from mock database
      const profile = mockProfiles[input.userId];
      
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found",
        });
      }
      
      // Update last login
      profile.lastLogin = new Date().toISOString();
      
      console.log(`✅ Backend: Profile retrieved for: ${profile.email}`);
      
      return {
        profile,
        success: true,
        message: "Profile retrieved successfully"
      };
    } catch (error) {
      console.error("❌ Backend profile error:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while fetching profile",
      });
    }
  });