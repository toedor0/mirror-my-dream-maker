import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { categoryEmoji, categoryLabel, timeAgo } from "@/lib/post-helpers";
import type { FeedPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  pin_x: number | null;
  pin_y: number | null;
  author_id: string;
  author?: { display_name: string; avatar_emoji: string | null; username: string } | null;
}

export function PostDetailModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);

  const load = async () => {
    const { data: p } = await supabase
      .from("posts")
      .select("*, author:profiles!posts_author_id_fkey(id,username,display_name,avatar_emoji)")
      .eq("id", postId)
      .maybeSingle();
    setPost(p as unknown as FeedPost);
    const { data: c } = await supabase
      .from("comments")
      .select("*, author:profiles!comments_author_id_fkey(display_name,avatar_emoji,username)")
      .eq("post_id", postId)
      .order("created_at");
    setComments((c ?? []) as unknown as Comment[]);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [postId]);

  const submit = async () => {
    if (!user) return toast.error("Yorum için giriş yap");
    if (!text.trim()) return;
    const { error } = await supabase.from("comments").insert({
      post_id: postId, author_id: user.id, content: text.trim(),
      pin_x: pin?.x ?? null, pin_y: pin?.y ?? null,
    });
    if (error) return toast.error(error.message);
    setText(""); setPin(null);
    load();
    queryClient.invalidateQueries({ queryKey: ["feed"] });
  };

  const sharePost = async () => {
    if (!post) return;
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {/* cancelled */}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Bağlantı kopyalandı");
    }
  };

  const onImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (post?.type !== "atolye") return;
    const r = e.currentTarget.getBoundingClientRect();
    setPin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl p-0 max-h-[90vh] overflow-hidden">
        {!post ? (
          <div className="p-12 text-center text-muted-foreground">Yükleniyor...</div>
        ) : (
          <div className="grid md:grid-cols-[1.2fr_1fr] max-h-[90vh]">
            <div className="bg-muted/40 relative" onClick={onImageClick}>
              {post.image_url ? (
                <>
                  <img src={post.image_url} alt={post.title} className="h-full w-full object-cover cursor-crosshair" />
                  {comments.filter((c) => c.pin_x !== null).map((c) => (
                    <div key={c.id} className="absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shadow-lg ring-2 ring-background"
                      style={{ left: `${c.pin_x}%`, top: `${c.pin_y}%` }} title={c.content}>
                      📍
                    </div>
                  ))}
                  {pin && (
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-amber-500 ring-2 ring-background animate-pulse"
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }} />
                  )}
                </>
              ) : (
                <div className="flex h-full min-h-64 items-center justify-center text-8xl">
                  {post.emoji ?? categoryEmoji(post.category)}
                </div>
              )}
            </div>

            <div className="flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">{post.author?.avatar_emoji ?? "🧵"}</div>
                  <div>
                    <p className="font-medium">{post.author?.display_name}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
                  </div>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold">{post.title}</h2>
                {post.category && <p className="mt-1 text-xs text-muted-foreground">{categoryLabel(post.category)}</p>}
                {post.content && <p className="mt-3 text-sm whitespace-pre-wrap">{post.content}</p>}
                <button onClick={sharePost} className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Share2 className="h-3.5 w-3.5" /> Paylaş
                </button>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Yorumlar ({comments.length})</p>
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm">{c.author?.avatar_emoji ?? "🧵"}</div>
                        <div className="flex-1">
                          <p className="text-sm"><span className="font-medium">{c.author?.display_name}</span> <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span></p>
                          <p className="text-sm">{c.content}</p>
                          {c.pin_x !== null && <p className="text-xs text-primary mt-0.5">📍 Görselde işaretli</p>}
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && <p className="text-sm text-muted-foreground">İlk yorumu sen yap.</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-3">
                {post.type === "atolye" && post.image_url && (
                  <p className="mb-2 text-xs text-muted-foreground">💡 Görsele tıkla → konuma pin + yorum bırak {pin && <span className="text-primary font-medium">· Pin hazır</span>}</p>
                )}
                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="Yorum yaz..."
                    className="flex-1 rounded-full border border-border bg-input/50 px-4 py-2 text-sm outline-none focus:border-primary"
                  />
                  <Button onClick={submit} size="icon" className="rounded-full"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}