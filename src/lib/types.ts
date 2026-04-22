export interface AuthorMini {
  id: string;
  username: string;
  display_name: string;
  avatar_emoji: string | null;
}

export interface FeedPost {
  id: string;
  author_id: string;
  type: "uretim" | "atolye" | "oneri" | "blog";
  title: string;
  content: string | null;
  category: string | null;
  hashtags: string[] | null;
  image_url: string | null;
  emoji: string | null;
  atolye_status: "bekliyor" | "cozuldu" | null;
  brand_name: string | null;
  brand_category: string | null;
  brand_rating: number | null;
  brand_price_label: string | null;
  brand_usage_months: number | null;
  read_minutes: number | null;
  created_at: string;
  author?: AuthorMini | null;
  like_count?: number;
  comment_count?: number;
  liked?: boolean;
  saved?: boolean;
}