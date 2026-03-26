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
      setUser: (user) => set({ user }),
      logout: () => {
        // Limpiar Zustand
        set({ user: null });

        // Limpiar cookies JWT
        document.cookie =
          "access_token=; path=/; domain=laveladazone.duckdns.org; max-age=0; secure; samesite=None";
        document.cookie =
          "refresh_token=; path=/; domain=laveladazone.duckdns.org; max-age=0; secure; samesite=None";
      },
      isAuthenticated: () => !!get().user,
    }),
    {
      name: "veladazone-auth",
    },
  ),
);
