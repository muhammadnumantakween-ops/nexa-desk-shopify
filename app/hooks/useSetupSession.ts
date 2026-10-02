import {useState, useEffect, useCallback} from 'react';
import type {DeviceProfile, Dock, Monitor} from '~/utils/compatibility';
import {checkDockCompatibility, checkMonitorCompatibility} from '~/utils/compatibility';

export interface AccessoryItem {
  id: string;
  variantId: string;
  title: string;
  price: string;
  product_role?: 'keyboard' | 'mouse' | 'stand' | string;
}

export interface SetupSessionState {
  selectedProfile: DeviceProfile | null;
  selectedDock: (Dock & {variantId?: string}) | null;
  selectedMonitor: (Monitor & {variantId?: string}) | null;
  selectedAccessories: AccessoryItem[];
}

const STORAGE_KEY = 'nexadesk_setup_session_v1';

const initialState: SetupSessionState = {
  selectedProfile: null,
  selectedDock: null,
  selectedMonitor: null,
  selectedAccessories: [],
};

export function useSetupSession() {
  const [session, setSession] = useState<SetupSessionState>(() => {
    if (typeof window === 'undefined') return initialState;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialState;
    } catch (e) {
      console.error('Failed to parse setup session from localStorage', e);
      return initialState;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save setup session to localStorage', e);
    }
  }, [session]);

  /**
   * Set Device Profile
   * Automatically validates and resets downstream selections (dock, monitor)
   * if they become incompatible with the newly selected profile.
   */
  const setProfile = useCallback((profile: DeviceProfile | null) => {
    setSession((prev) => {
      if (!profile) {
        return {
          ...prev,
          selectedProfile: null,
          selectedDock: null,
          selectedMonitor: null,
        };
      }

      // Check if current dock remains compatible with new profile
      let validDock = prev.selectedDock;
      let validMonitor = prev.selectedMonitor;

      if (validDock) {
        const dockCheck = checkDockCompatibility(profile, validDock);
        if (!dockCheck.compatible) {
          validDock = null;
          validMonitor = null; // Monitor depends on valid dock video ports
        }
      }

      // If dock was reset or changed, verify monitor
      if (validDock && validMonitor) {
        const monitorCheck = checkMonitorCompatibility(validDock, validMonitor);
        if (!monitorCheck.compatible) {
          validMonitor = null;
        }
      }

      return {
        ...prev,
        selectedProfile: profile,
        selectedDock: validDock,
        selectedMonitor: validMonitor,
      };
    });
  }, []);

  /**
   * Set Dock
   * Automatically validates/resets monitor if it does not match dock video outputs.
   */
  const setDock = useCallback((dock: (Dock & {variantId?: string}) | null) => {
    setSession((prev) => {
      if (!dock) {
        return {
          ...prev,
          selectedDock: null,
          selectedMonitor: null,
        };
      }

      // If existing monitor is incompatible with this new dock, reset monitor
      let validMonitor = prev.selectedMonitor;
      if (validMonitor) {
        const monitorCheck = checkMonitorCompatibility(dock, validMonitor);
        if (!monitorCheck.compatible) {
          validMonitor = null;
        }
      }

      return {
        ...prev,
        selectedDock: dock,
        selectedMonitor: validMonitor,
      };
    });
  }, []);

  /**
   * Set Monitor
   */
  const setMonitor = useCallback(
    (monitor: (Monitor & {variantId?: string}) | null) => {
      setSession((prev) => ({
        ...prev,
        selectedMonitor: monitor,
      }));
    },
    [],
  );

  /**
   * Add Accessory (e.g. keyboard, mouse, stand)
   */
  const addAccessory = useCallback((accessory: AccessoryItem) => {
    setSession((prev) => {
      const exists = prev.selectedAccessories.some(
        (item) => item.id === accessory.id,
      );
      if (exists) return prev;
      return {
        ...prev,
        selectedAccessories: [...prev.selectedAccessories, accessory],
      };
    });
  }, []);

  /**
   * Remove Accessory
   */
  const removeAccessory = useCallback((accessoryId: string) => {
    setSession((prev) => ({
      ...prev,
      selectedAccessories: prev.selectedAccessories.filter(
        (item) => item.id !== accessoryId,
      ),
    }));
  }, []);

  /**
   * Toggle Accessory
   */
  const toggleAccessory = useCallback((accessory: AccessoryItem) => {
    setSession((prev) => {
      const exists = prev.selectedAccessories.some(
        (item) => item.id === accessory.id,
      );
      if (exists) {
        return {
          ...prev,
          selectedAccessories: prev.selectedAccessories.filter(
            (item) => item.id !== accessory.id,
          ),
        };
      }
      return {
        ...prev,
        selectedAccessories: [...prev.selectedAccessories, accessory],
      };
    });
  }, []);

  /**
   * Reset Entire Setup Session
   */
  const resetSession = useCallback(() => {
    setSession(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear setup session from localStorage', e);
    }
  }, []);

  return {
    session,
    setProfile,
    setDock,
    setMonitor,
    addAccessory,
    removeAccessory,
    toggleAccessory,
    resetSession,
  };
}
