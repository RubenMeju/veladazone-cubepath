export interface Achievement {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  category: "predicciones" | "debate" | "social" | "ligas" | "especial";
  points: number;
}

export interface UserAchievement {
  achievement: Achievement;
  unlocked_at: string;
}

export interface MyAchievementsResponse {
  total_points: number;
  unlocked_count: number;
  unlocked: UserAchievement[];
  locked: Achievement[];
}

export interface PublicAchievementsResponse {
  total_points: number;
  achievements: UserAchievement[];
}
