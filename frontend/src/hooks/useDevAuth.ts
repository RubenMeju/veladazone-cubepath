import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";

export function useDevAuth() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (user) return; // ya está logueado, no hacer nada

    api
      .get<User>("/users/me/")
      .then((u) => setUser(u))
      .catch(() => {}); // silencioso, no importa si falla
  }, []);
}
