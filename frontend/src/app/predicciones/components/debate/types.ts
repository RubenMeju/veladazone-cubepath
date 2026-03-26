export interface ArgumentReply {
  id: number;
  username: string;
  avatar: string | null;
  text: string;
  created_at: string;
  time_ago: string; // ← añadir
}

export interface Argument {
  id: number;
  username: string;
  avatar: string | null;
  fighter_name: string;
  fighter_flag: string;
  text: string;
  vote_count: number;
  edited: boolean;
  replies: ArgumentReply[];
  user_voted: boolean;
  user_replied: boolean;
  created_at: string;
  time_ago: string;
}
