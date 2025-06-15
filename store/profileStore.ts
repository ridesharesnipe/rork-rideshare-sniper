import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverProfile } from '@/types';

interface ProfileState {
  profiles: DriverProfile[];
  activeProfileId: string | null;
  
  addProfile: (profile: Omit<DriverProfile, 'id'>) => void;
  updateProfile: (id: string, updates: Partial<DriverProfile>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  getActiveProfile: () => DriverProfile | null;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [
        {
          id: '1',
          name: 'Standard',
          minFare: 10,
          maxPickupDistance: 5,
          maxDrivingDistance: 15,
          isActive: true,
          minFarePerMile: 2,
          minFarePerMinute: 0.5,
        },
        {
          id: '2',
          name: 'Rush Hour',
          minFare: 15,
          maxPickupDistance: 3,
          maxDrivingDistance: 10,
          isActive: false,
          minFarePerMile: 3,
          minFarePerMinute: 0.75,
        },
        {
          id: '3',
          name: 'Late Night',
          minFare: 12,
          maxPickupDistance: 7,
          maxDrivingDistance: 20,
          isActive: false,
          minFarePerMile: 2.5,
          minFarePerMinute: 0.6,
        },
      ],
      activeProfileId: '1',
      
      addProfile: (profile) => {
        const id = Date.now().toString();
        set((state) => {
          // Make sure all other profiles are set to inactive
          const updatedProfiles = state.profiles.map(p => ({
            ...p,
            isActive: false
          }));
          
          return {
            profiles: [...updatedProfiles, { ...profile, id, isActive: true }],
            activeProfileId: id
          };
        });
        
        console.log(`New profile created: ${profile.name}`);
      },
      
      updateProfile: (id, updates) => {
        set((state) => {
          // If we're setting this profile to active, make sure all others are inactive
          if (updates.isActive) {
            return {
              profiles: state.profiles.map((profile) => 
                profile.id === id 
                  ? { ...profile, ...updates } 
                  : { ...profile, isActive: false }
              ),
              activeProfileId: id
            };
          }
          
          // Otherwise just update the profile
          return {
            profiles: state.profiles.map((profile) =>
              profile.id === id ? { ...profile, ...updates } : profile
            )
          };
        });
        
        console.log(`Profile updated: ${id}`);
      },
      
      deleteProfile: (id) => {
        const { profiles, activeProfileId } = get();
        
        // Don't allow deleting the last profile
        if (profiles.length <= 1) {
          console.log("Cannot delete the last profile");
          return;
        }
        
        set((state) => {
          const filteredProfiles = state.profiles.filter((profile) => profile.id !== id);
          
          // If we're deleting the active profile, set the first remaining profile as active
          if (state.activeProfileId === id) {
            const newActiveId = filteredProfiles[0].id;
            return {
              profiles: filteredProfiles.map((profile, index) => ({
                ...profile,
                isActive: profile.id === newActiveId
              })),
              activeProfileId: newActiveId
            };
          }
          
          return {
            profiles: filteredProfiles
          };
        });
        
        console.log(`Profile deleted: ${id}`);
      },
      
      setActiveProfile: (id) => {
        set((state) => ({
          activeProfileId: id,
          profiles: state.profiles.map((profile) => ({
            ...profile,
            isActive: profile.id === id,
          })),
        }));
        
        console.log(`Active profile set to: ${id}`);
      },
      
      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((profile) => profile.id === activeProfileId) || null;
      },
    }),
    {
      name: 'rideshare-sniper-profiles',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);