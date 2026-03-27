"use client";

import { useDevAuth } from "@/hooks/useDevAuth";

export function DevAuthInit() {
  useDevAuth();
  return null;
}