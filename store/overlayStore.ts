import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface OverlayStore {
  overlayVisible: boolean;
  tripQuality: 'green' | 'yellow' | 'red';
  acceptPosition: { x: number; y: number };
  rejectPosition: { x: number; y: number };
  positioningMode: boolean;
  showOverlay: (quality: 'green' | 'yellow' | 'red') => void;
  hideOverlay: () => void;
  updatePosition: (widget: 'accept' | 'reject', position: { x: number; y: number }) => void;
  togglePositioningMode: () => void;
}

export const useOverlayStore = create<OverlayStore>()(
  persist(
    (set) => ({
      overlayVisible: false,
      tripQuality: 'green',
      acceptPosition: { x: screenWidth * 0.075, y: screenHeight - 180 },
      rejectPosition: { x: screenWidth - 65, y: screenHeight * 0.35 },
      positioningMode: false,
      showOverlay: (quality) => set({ overlayVisible: true, tripQuality: quality }),
      hideOverlay: () => set({ overlayVisible: false }),
      updatePosition: (widget, position) =>
        set((state) => ({
          ...(widget === 'accept' ? { acceptPosition: position } : { rejectPosition: position }),
        })),
      togglePositioningMode: () => set((state) => ({ positioningMode: !state.positioningMode })),
    }),
    {
      name: 'overlay-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);