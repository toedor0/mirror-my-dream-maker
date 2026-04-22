import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categoryEmoji, categoryLabel, timeAgo } from "@/lib/post-helpers";
import type { FeedPost } from "@/lib/types";
import { CardActions } from "./CardActions";

export function AtolyeCard({ post, onOpen }: { post: FeedPost; onOpen: () => void }) {
  const solved = post.atolye_status === "cozuldu";

  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden transition hover:shadow-md">
      <div className={`h-1 ${solved ? "bg-emerald-400" : "bg-rose-400"}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              to="/profil/$username"
              params={{ username: post.author?.username ?? "" }}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm">
                {post.author?.avatar_emoji ?? "🧵"}
              </span>
              <span className="font-medium text-foreground">{post.author?.display_name}</span>
            </Link>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
            {post.category && (
              <span className="hidden sm:inline rounded-full bg-muted px-2 py-0.5">
                {categoryEmoji(post.category)} {categoryLabel(post.category)}
              </span>
            )}
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            solved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                   : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
          }`}>
            {solved ? "✓ Çözüldü" : "⚑ Bekliyor"}
          </span>
        </div>

        <h3 className="mt-3 font-serif text-lg font-semibold leading-tight cursor-pointer" onClick={onOpen}>
          {post.title}
        </h3>

        {post.content && (
          <div className="mt-2 rounded-xl bg-muted/60 p-3 text-sm text-foreground/90 line-clamp-3">
            {post.content}
          </div>
        )}

        {post.image_url && (
          <button onClick={onOpen} className="mt-3 block w-full overflow-hidden rounded-xl">
            <img src={post.image_url} alt={post.title} className="aspect-video w-full object-cover" loading="lazy" />
          </button>
        )}

        <div className="mt-3 flex items-center justify-between">
          <CardActions post={post} icons={{ Heart, MessageCircle, Bookmark, Share2 }} compact />
          <button onClick={onOpen} className="text-sm font-medium text-primary hover:underline">
            {solved ? "Çözümü Gör →" : "Yardım Et →"}
          </button>
        </div>
      </div>
    </article>
  );
}