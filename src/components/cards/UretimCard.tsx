import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categoryEmoji, categoryLabel, timeAgo } from "@/lib/post-helpers";
import type { FeedPost } from "@/lib/types";
import { CardActions } from "./CardActions";

export function UretimCard({ post, onOpen }: { post: FeedPost; onOpen: () => void }) {
  return (
    <article className="group rounded-2xl border border-border bg-card overflow-hidden transition hover:shadow-md">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[4/3] bg-accent/40 overflow-hidden">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-7xl">
              {post.emoji ?? categoryEmoji(post.category)}
            </div>
          )}
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/85 backdrop-blur px-3 py-1 text-xs font-medium">
              {categoryEmoji(post.category)} {categoryLabel(post.category)}
            </span>
          )}
        </div>
      </button>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            to="/profil/$username"
            params={{ username: post.author?.username ?? "" }}
            className="flex items-center gap-2 hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm">
              {post.author?.avatar_emoji ?? "🧵"}
            </span>
            <span className="font-medium text-foreground">{post.author?.display_name}</span>
          </Link>
          <span>·</span>
          <span>{timeAgo(post.created_at)}</span>
        </div>

        <h3 className="mt-2 font-serif text-lg font-semibold leading-tight cursor-pointer" onClick={onOpen}>
          {post.title}
        </h3>
        {post.content && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
        )}
        {post.hashtags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.hashtags.slice(0, 4).map((h) => (
              <span key={h} className="text-xs text-primary">#{h}</span>
            ))}
          </div>
        ) : null}

        <CardActions post={post} icons={{ Heart, MessageCircle, Bookmark, Share2 }} onCommentClick={onOpen} />
      </div>
    </article>
  );
}