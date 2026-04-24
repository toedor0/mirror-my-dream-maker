import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { FeedPost } from "@/lib/types";
import { UretimCard } from "@/components/cards/UretimCard";
import { AtolyeCard } from "@/components/cards/AtolyeCard";
import { OneriCard } from "@/components/cards/OneriCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PostDetailModal } from "@/components/feed/PostDetailModal";
import { FeedWidget } from "@/components/feed/FeedWidget";

type FilterType = "all" | "uretim" | "atolye" | "oneri" | "blog";

export function FeedList({ filter = "all", category, authorId, savedByUser, followingOnly }: {
  filter?: FilterType;
  category?: string;
  authorId?: string;
  savedByUser?: boolean;
  followingOnly?: boolean;
}) {
  const { user } = useAuth();
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["feed", filter, category, authorId, savedByUser, followingOnly, user?.id],
    queryFn: async (): Promise<FeedPost[]> => {
      let postIds: string[] | null = null;
      if (savedByUser && user) {
        const { data: s } = await supabase.from("saves").select("post_id").eq("user_id", user.id);
        postIds = (s ?? []).map((r) => r.post_id);
        if (postIds.length === 0) return [];
      }
      let authorIds: string[] | null = null;
      if (followingOnly && user) {
        const { data: f } = await supabase.from("follows").select("following_id").eq("follower_id", user.id);
        authorIds = (f ?? []).map((r) => r.following_id);
        if (authorIds.length === 0) return [];
      }

      let q = supabase
        .from("posts")
        .select("*, author:profiles!posts_author_id_fkey(id,username,display_name,avatar_emoji)")
        .eq("hidden", false)
        .order("created_at", { ascending: false })
        .limit(40);
      if (filter !== "all") q = q.eq("type", filter);
      if (category) q = q.eq("category", category);
      if (authorId) q = q.eq("author_id", authorId);
      if (postIds) q = q.in("id", postIds);
      if (authorIds) q = q.in("author_id", authorIds);

      const { data, error } = await q;
      if (error) throw error;
      const list = (data ?? []) as unknown as FeedPost[];

      // Counts
      if (list.length) {
        const ids = list.map((p) => p.id);
        const [likes, comments, myLikes, mySaves] = await Promise.all([
          supabase.from("likes").select("post_id").in("post_id", ids),
          supabase.from("comments").select("post_id").in("post_id", ids),
          user ? supabase.from("likes").select("post_id").eq("user_id", user.id).in("post_id", ids) : Promise.resolve({ data: [] }),
          user ? supabase.from("saves").select("post_id").eq("user_id", user.id).in("post_id", ids) : Promise.resolve({ data: [] }),
        ]);
        const lc = new Map<string, number>();
        (likes.data ?? []).forEach((r) => lc.set(r.post_id, (lc.get(r.post_id) ?? 0) + 1));
        const cc = new Map<string, number>();
        (comments.data ?? []).forEach((r) => cc.set(r.post_id, (cc.get(r.post_id) ?? 0) + 1));
        const liked = new Set((myLikes.data ?? []).map((r) => r.post_id));
        const saved = new Set((mySaves.data ?? []).map((r) => r.post_id));
        list.forEach((p) => {
          p.like_count = lc.get(p.id) ?? 0;
          p.comment_count = cc.get(p.id) ?? 0;
          p.liked = liked.has(p.id);
          p.saved = saved.has(p.id);
        });
      }
      return list;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="text-5xl mb-3">🧵</div>
        <p className="font-serif text-xl font-semibold">Henüz içerik yok</p>
        <p className="mt-1 text-sm text-muted-foreground">İlk paylaşımı sen yap!</p>
      </div>
    );
  }

  const widgets = [
    { after: 1, kind: "theme" as const },
    { after: 4, kind: "creators" as const },
    { after: 7, kind: "inspiration" as const },
  ];

  return (
    <>
      <div className="space-y-4">
        {posts.map((post, i) => {
          const widget = widgets.find((w) => w.after === i);
          return (
            <div key={post.id} className="space-y-4">
              {renderCard(post, () => setOpenId(post.id))}
              {widget && <FeedWidget kind={widget.kind} />}
            </div>
          );
        })}
      </div>

      {openId && (
        <PostDetailModal postId={openId} onClose={() => setOpenId(null)} />
      )}
    </>
  );
}

function renderCard(post: FeedPost, onOpen: () => void) {
  switch (post.type) {
    case "atolye": return <AtolyeCard post={post} onOpen={onOpen} />;
    case "oneri": return <OneriCard post={post} onOpen={onOpen} />;
    case "blog": return <BlogCard post={post} onOpen={onOpen} />;
    default: return <UretimCard post={post} onOpen={onOpen} />;
  }
}