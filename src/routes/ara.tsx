import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Hash, User as UserIcon, FileText } from "lucide-react";
import { categoryEmoji, timeAgo } from "@/lib/post-helpers";
import type { FeedPost } from "@/lib/types";

export const Route = createFileRoute("/ara")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/ara" });
  const [text, setText] = useState(q);

  useEffect(() => setText(q), [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: text.trim() } });
  };

  const term = q.trim();
  const isTag = term.startsWith("#");
  const isUser = term.startsWith("@");
  const cleanTerm = term.replace(/^[#@]/, "");

  const { data, isLoading } = useQuery({
    queryKey: ["search", term],
    enabled: term.length > 0,
    queryFn: async () => {
      const like = `%${cleanTerm}%`;
      const [postsRes, usersRes, tagPostsRes] = await Promise.all([
        isUser
          ? Promise.resolve({ data: [] as FeedPost[] })
          : supabase
              .from("posts")
              .select("*, author:profiles!posts_author_id_fkey(id,username,display_name,avatar_emoji)")
              .eq("hidden", false)
              .or(`title.ilike.${like},content.ilike.${like}`)
              .order("created_at", { ascending: false })
              .limit(20),
        isTag
          ? Promise.resolve({ data: [] })
          : supabase
              .from("profiles")
              .select("id,username,display_name,avatar_emoji,bio,city")
              .or(`username.ilike.${like},display_name.ilike.${like}`)
              .limit(15),
        supabase
          .from("posts")
          .select("*, author:profiles!posts_author_id_fkey(id,username,display_name,avatar_emoji)")
          .eq("hidden", false)
          .contains("hashtags", [cleanTerm.toLowerCase()])
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      const seen = new Set<string>();
      const merged = [...((postsRes.data as unknown as FeedPost[]) ?? []), ...((tagPostsRes.data as unknown as FeedPost[]) ?? [])]
        .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
      return {
        posts: merged,
        users: (usersRes.data ?? []) as Array<{ id: string; username: string; display_name: string; avatar_emoji: string | null; bio: string | null; city: string | null }>,
      };
    },
  });

  return (
    <AppLayout>
      <h1 className="font-serif text-3xl font-bold tracking-tight">Ara</h1>
      <p className="mt-1 text-sm text-muted-foreground">Gönderi, üye veya #etiket bul</p>

      <form onSubmit={submit} className="relative mt-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ara: kelime, @kullanıcı veya #etiket"
          className="w-full rounded-full border border-border bg-input/40 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
        />
      </form>

      {!term ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">Aramaya başlamak için bir şeyler yaz.</p>
      ) : isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {data?.users.length ? (
            <section>
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <UserIcon className="h-3.5 w-3.5" /> Üyeler ({data.users.length})
              </h2>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
                {data.users.map((u) => (
                  <li key={u.id}>
                    <Link to="/profil/$username" params={{ username: u.username }} className="flex items-center gap-3 p-3 hover:bg-muted/40 transition">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg">{u.avatar_emoji ?? "🧵"}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{u.display_name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{u.username}{u.city ? ` · ${u.city}` : ""}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {data?.posts.length ? (
            <section>
              <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isTag ? <Hash className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />} Gönderiler ({data.posts.length})
              </h2>
              <ul className="space-y-2">
                {data.posts.map((p) => (
                  <li key={p.id} className="rounded-2xl border border-border bg-card p-3 hover:bg-muted/40 transition">
                    <Link to="/profil/$username" params={{ username: p.author?.username ?? "" }} className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-2xl">
                        {p.image_url ? <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" /> : (p.emoji ?? categoryEmoji(p.category))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{p.author?.username} · {timeAgo(p.created_at)}{p.category ? ` · ${categoryEmoji(p.category)}` : ""}
                        </p>
                        {p.hashtags?.length ? (
                          <p className="mt-1 truncate text-xs text-primary">{p.hashtags.slice(0, 4).map((h) => `#${h}`).join(" ")}</p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {!data?.users.length && !data?.posts.length && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <p className="font-serif text-lg font-semibold">"{term}" için sonuç yok</p>
              <p className="mt-1 text-sm text-muted-foreground">Farklı bir kelime, @kullanıcı veya #etiket dene.</p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}