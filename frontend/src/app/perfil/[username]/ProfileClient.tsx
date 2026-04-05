// Sin "use client" — este componente es un Server Component.
// El único Client Component es ShareProfileButton (necesita window).

import { Suspense } from "react";
import { ProfileArguments } from "./components/ProfileArguments";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileLeagues } from "./components/ProfileLeagues";
import { ProfilePredictions } from "./components/ProfilePredictions";
import { ProfileStats } from "./components/ProfileStats";
import { ShareProfileButton } from "./components/ShareProfileButton";
import { ProfileData } from "./types";
import { ProfileAchievements } from "@/components/achievements/ProfileAchievements";

interface Props {
  data: ProfileData;
  username: string;
}

export function ProfileClient({ data, username }: Props) {
  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      <ProfileHeader data={data} />

      <ProfileStats stats={data.stats} betrayal_count={data.betrayal_count} />
      <Suspense fallback={null}>
        <ProfileAchievements username={username} />
      </Suspense>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <ProfilePredictions predictions={data.predictions} />
        <ProfileArguments args={data.arguments} />
        <ProfileLeagues
          leagues_created={data.leagues_created}
          leagues_joined={data.leagues_joined}
        />
      </div>

      <div className="mt-6 text-center">
        <ShareProfileButton
          username={username}
          displayName={data.display_name}
        />
      </div>
    </div>
  );
}
