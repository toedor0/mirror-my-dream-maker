import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { FeedPost } from "@/lib/types";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface Props {
  post: FeedPost;
  icons: { Heart: LucideIcon; MessageCircle: LucideIcon; Bookmark: LucideIcon; Share2: LucideIcon };
  compact?: boolean;
  onCommentClick?: () => void;
}

export function CardActions({ post, icons, compact, onCommentClick }: Props) {
  const { Heart, MessageCircle, Bookmark, Share2 } = icons;
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked ?? false);
  const [saved, setSaved] = useState(post.saved ?? false);
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error("Beğenmek için giriş yapmalısın");
    if (liked) {
      setLiked(false); setLikeCount((c) => Math.max(0, c - 1));
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      setLiked(true); setLikeCount((c) => c + 1);
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id });
    }
  };

  const toggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error("Kaydetmek için giriş yapmalısın");
    if (saved) {
      setSaved(false);
      await supabase.from("saves").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      setSaved(true);
      await supabase.from("saves").insert({ user_id: user.id, post_id: post.id });
      toast.success("Kaydedildi");
    }
  };

  const share = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {/* cancelled */}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Bağlantı kopyalandı");
    }
  };

  return (
    <div className={`flex items-center gap-${compact ? "3" : "4"} ${compact ? "" : "mt-3 pt-3 border-t border-border"}`}>
      <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-rose-500 transition">
        <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
        {likeCount > 0 && <span>{likeCount}</span>}
      </button>
      <button onClick={(e) => { e.stopPropagation(); onCommentClick?.(); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <MessageCircle className="h-4 w-4" />
        {post.comment_count ? <span>{post.comment_count}</span> : null}
      </button>
      <button onClick={toggleSave} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition">
        <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
      </button>
      <button onClick={share} className="ml-auto text-muted-foreground hover:text-foreground">
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}