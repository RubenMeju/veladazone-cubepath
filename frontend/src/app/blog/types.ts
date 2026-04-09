import { Fighter } from "@/types";

// Añadir a frontend/src/types/index.ts
export interface BlogPost {
  id: number;
  fighter: Fighter | null;
  youtube_id: string;
  title: string;
  thumbnail_url: string;
  published_at: string;
  view_count: number;
  relevance_score: number;
  ai_summary: string;
  ai_quote: string;
  ai_tags: string[];
  status: string;
}
