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
}

export interface Prediction {
  id: number;
  fight: Fight;
  predicted_winner: Fighter;
  ai_comment: string | null;
  is_correct: boolean | null;
  created_at: string;
}

export interface User {
  id: number;
  twitch_username: string;
  avatar_url: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string | null;
  correct: number;
  total: number;
  accuracy: number;
}

export interface FantasyLeague {
  id: number;
  name: string;
  invite_code: string | null;
  member_count: number;
  created_at: string;
}

export interface LeagueMember {
  rank: number;
  username: string;
  avatar: string | null;
  points: number;
}
