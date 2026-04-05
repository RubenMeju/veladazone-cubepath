import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import type { MyAchievementsResponse } from "@/components/achievements/types";
import { LogrosClient } from "./LogrosClient";
import { LogrosSkeleton } from "./components/LogrosSkeleton";

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
