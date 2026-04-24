import { Heart, MessageCircle, Bookmark, Share2, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { timeAgo } from "@/lib/post-helpers";
import type { FeedPost } from "@/lib/types";
import { CardActions } from "./CardActions";

export function OneriCard({ post, onOpen }: { post: FeedPost; onOpen: () => void }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link
          to="/profil/$username"
          params={{ username: post.author?.username ?? "" }}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm">
            {post.author?.avatar_emoji ?? "🧵"}
          </span>
          <span className="font-medium text-foreground">{post.author?.display_name}</span>
          <span>· {timeAgo(post.created_at)}</span>
        </Link>
        <span className="rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 px-2.5 py-1 text-xs font-medium">
          ⭐ Topluluk Önerisi
        </span>
      </div>

      {post.brand_name && (
        <div
          className="mt-3 rounded-xl border border-amber-200/50 dark:border-amber-900/50 p-4"
          style={{ background: "linear-gradient(135deg, oklch(0.95 0.07 80 / 0.6), oklch(0.92 0.09 70 / 0.6))" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-serif text-lg font-bold">{post.brand_name}</p>
              {post.brand_category && <p className="text-xs text-amber-900/70 dark:text-amber-200/70">{post.brand_category}</p>}
            </div>
            {typeof post.brand_rating === "number" && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < post.brand_rating! ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40"}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {post.brand_price_label && (
              <span className="rounded-full bg-background/60 px-2 py-0.5">{post.brand_price_label}</span>
            )}
            {post.brand_usage_months ? (
              <span className="rounded-full bg-background/60 px-2 py-0.5">{post.brand_usage_months} aydır kullanıyor</span>
            ) : null}
          </div>
        </div>
      )}

      <h3 className="mt-3 font-serif text-base font-semibold leading-tight cursor-pointer" onClick={onOpen}>
        {post.title}
      </h3>
      {post.content && <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{post.content}</p>}
      {post.hashtags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.hashtags.slice(0, 4).map((h) => (
            <span key={h} className="text-xs text-primary">#{h}</span>
          ))}
        </div>
      ) : null}

      <CardActions post={post} icons={{ Heart, MessageCircle, Bookmark, Share2 }} onCommentClick={onOpen} />
    </article>
  );
}