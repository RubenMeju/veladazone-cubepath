import { FantasyLeague } from "@/types";

export interface ProfileData {
  username: string;
  display_name: string;
  avatar: string | null;
  profile_views: number;
  stats: {
    total: number;
    correct: number;
    accuracy: number;
    badge: {
      label: string;
      color: string;
      emoji: string;
    };
  };
  betrayal_count: number;
  predictions: {
    fight: string;
    pick: string;
    pick_flag: string;
    is_correct: boolean | null;
  }[];
  arguments: {
    fight: string;
    fighter: string;
    text: string;
    votes: number;
  }[];
  leagues_created: FantasyLeague[];
  leagues_joined: FantasyLeague[];
}
