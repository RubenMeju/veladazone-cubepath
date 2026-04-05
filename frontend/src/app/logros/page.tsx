import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { LogrosClient } from "./LogrosClient";
import type { MyAchievementsResponse } from "@/components/achievements/types";

export const metadata: Metadata = {
  title: "Mis Logros",
  description: "Tus logros y medallas en VeladaZone.",
};

const SERVER_API_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/v1`
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1");

async function getMyAchievements(): Promise<MyAchievementsResponse | null> {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isDev) {
      headers["x-dev-user"] = "devuser";
    } else {
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();
      if (cookieString) headers["Cookie"] = cookieString;
    }

    const res = await fetch(`${SERVER_API_URL}/achievements/`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function LogrosSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-48 bg-white/10 rounded mb-2" />
      <div className="h-4 w-64 bg-white/5 rounded mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-white/5 rounded-2xl border border-white/5"
          />
        ))}
      </div>
    </div>
  );
}

async function LogrosData() {
  const data = await getMyAchievements();
  return <LogrosClient data={data} />;
}

export default function LogrosPage() {
  return (
    <div className="page-container">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-5" />
      </div>
      <Suspense fallback={<LogrosSkeleton />}>
        <LogrosData />
      </Suspense>
    </div>
  );
}
