export interface User {
  id: number;
  twitch_username: string;
  avatar_url: string | null;
  username: string;
}

export interface Argument {
  id: number;
  user: User;
  fight: Fight;
  fighter_supported: Fighter;
  text: string;
  edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Fighter {
  id: number;
  name: string;
  slug: string;
  country: string;
  country_flag: string;
  avatar_url: string | null;
  twitter: string | null;
  twitch: string | null;
  bio: string | null;
  record: {
    wins: number;
    losses: number;
  };
}

export interface Edition {
  id: number;
  number: number;
  year: number;
  date: string | null;
  venue: string | null;
  city: string | null;
  fights: Fight[];
}

export interface Fight {
  id: number;
  fighter1: Fighter;
  fighter2: Fighter;
  winner: Fighter | null;
  is_main_event: boolean;
  order: number;
  result_method: string;
  is_completed: boolean;
  youtube_url: string;
}

export interface Prediction {
  id: number;
  fight: Fight;
  predicted_winner: Fighter;
  ai_comment: string | null;
  is_correct: boolean | null;
  betrayal_count: number;

  created_at: string;
}

export interface Badge {
  label: string;
  color: string;
  emoji: string;
}

export interface LeaderboardEntry {
  id?: number; // opcional si no viene del backend
  rank: number;
  username: string;
  avatar: string | null;
  correct: number;
  total: number;
  accuracy: number;
  badge: Badge;
}

export interface FantasyLeague {
  id: number;
  name: string;
  invite_code: string | null;
  member_count: number;
  is_private: boolean;
  created_at: string;
}

export interface LeagueMember {
  rank: number;
  username: string;
  avatar: string | null;
  points: number;
}
export interface CommunityStats {
  fight_id: number;
  fighter1_pct: number;
  fighter2_pct: number;
  total_votes: number;
}

export interface OpponentProfile {
  username: string;
  display_name: string;
  avatar: string | null;
  stats: {
    accuracy: number;
    total: number;
    correct: number;
    badge: { label: string; color: string; emoji: string };
  };
  predictions: {
    fight: string;
    pick: string;
    pick_flag: string;
    is_correct: boolean | null;
  }[];
}
