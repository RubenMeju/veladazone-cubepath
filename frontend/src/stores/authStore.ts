import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        console.log("Setting user:", user);
        set({ user });
      },
      logout: () => {
        console.log("Logging out user:", get().user);
        // Limpiar Zustand
        set({ user: null });
      },
      isAuthenticated: () => !!get().user,
    }),
    {
      name: "veladazone-auth",
    },
  ),
);
