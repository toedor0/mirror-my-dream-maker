import type { FeedPost } from "@/lib/types";
import { categoryLabel } from "@/lib/post-helpers";

export function BlogCard({ post, onOpen }: { post: FeedPost; onOpen: () => void }) {
  return (
    <article className="flex rounded-2xl border border-border bg-card overflow-hidden transition hover:shadow-md">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 bg-gradient-to-b from-primary/15 to-primary/5 p-4">
        <span className="text-3xl">{post.emoji ?? "📖"}</span>
        <span className="text-xs text-muted-foreground">{post.read_minutes ?? 5} dk</span>
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">Admin</span>
          {post.category && (
            <span className="rounded-full bg-muted px-2 py-0.5">{categoryLabel(post.category)}</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-serif text-[10px] font-bold text-primary-foreground">
            ÇD
          </div>
          <span className="text-xs font-medium">Çift Dikiş</span>
        </div>
        <h3 className="mt-2 font-serif text-lg font-semibold leading-tight cursor-pointer" onClick={onOpen}>
          {post.title}
        </h3>
        {post.content && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>}
        <button onClick={onOpen} className="mt-2 text-sm font-medium text-primary hover:underline">
          Oku →
        </button>
      </div>
    </article>
  );
}